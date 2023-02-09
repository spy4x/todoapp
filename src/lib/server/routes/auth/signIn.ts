import { auth } from '../../lucia';
import type { BaseRequest, Context } from '../../helpers';
import { send } from '../../helpers';

export const signInCommand = 'signIn';

export interface SignInRequest extends BaseRequest {
  t: typeof signInCommand;
  username: string;
  password: string;
}

export type SignInResponse =
  | { t: 'signInSuccess'; u: string; s: string }
  | { t: 'signInFail' };

export async function signIn(
  context: Context<SignInRequest, SignInResponse>,
): Promise<void> {
  try {
    const { username, password } = context.request;
    const { userId } = await auth.validateKeyPassword(
      'username',
      username,
      password,
    );
    const { sessionId } = await auth.createSession(userId);
    context.userId = userId;
    context.sessionId = sessionId;
    context.response = {
      t: 'signInSuccess',
      u: context.userId,
      s: context.sessionId,
    };
    return send(context);
  } catch (error) {
    console.log('signIn', error);
    context.response = { t: 'signInFail' };
    return send(context);
  }
}
