import { auth } from '../../lucia';
import type { BaseRequest, Context } from '../../helpers';
import { send } from '../../helpers';

export const reSignInCommand = 'reSignIn';

export interface ReSignInRequest extends BaseRequest {
  t: typeof reSignInCommand;
  sessionId: string;
}

export type ReSignInResponse =
  | { t: 'reSignInSuccess'; u: string; s: string }
  | { t: 'reSignInFail' };

export async function reSignIn(
  context: Context<ReSignInRequest, ReSignInResponse>,
): Promise<void> {
  try {
    const { sessionId } = context.request;
    const session = await auth.validateSession(sessionId);
    context.userId = session.userId;
    context.sessionId = session.sessionId;
    context.response = {
      t: 'reSignInSuccess',
      u: context.userId,
      s: context.sessionId,
    };
    return send(context);
  } catch (error) {
    console.log('reSignIn', error);
    context.response = { t: 'reSignInFail' };
    return send(context);
  }
}
