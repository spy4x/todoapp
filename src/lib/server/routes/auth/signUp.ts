import { auth } from '../../lucia';
import type { BaseRequest, Context } from '../../helpers';
import { send } from '../../helpers';

export const signUpCommand = 'signUp';

export interface SignUpRequest extends BaseRequest {
  t: typeof signUpCommand;
  username: string;
  password: string;
}

export type SignUpResponse =
  | { t: 'signUpSuccess'; u: string; s: string }
  | { t: 'signUpFail' };

export async function signUp(
  context: Context<SignUpRequest, SignUpResponse>,
): Promise<void> {
  try {
    const { username, password } = context.request;
    const { userId } = await auth.createUser({
      key: {
        providerId: 'username',
        providerUserId: username,
        password,
      },
      attributes: {},
    });
    const { sessionId } = await auth.createSession(userId);
    context.userId = userId;
    context.sessionId = sessionId;
    context.response = {
      t: 'signUpSuccess',
      u: context.userId,
      s: context.sessionId,
    };
    return send(context);
  } catch (error) {
    console.log('signUp', error);
    context.response = { t: 'signUpFail' };
    return send(context);
  }
}
