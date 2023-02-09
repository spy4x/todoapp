import { auth } from '../../lucia';
import type { BaseRequest, Context } from '../../helpers';
import { authenticatedClients, send } from '../../helpers';

export const signOutCommand = 'signOut';

export interface SignOutRequest extends BaseRequest {
  t: typeof signOutCommand;
}

export type SignOutResponse = { t: 'signOutSuccess' } | { t: 'signOutFail' };

export async function signOut(
  context: Context<SignOutRequest, SignOutResponse>,
): Promise<void> {
  try {
    await auth.invalidateSession(context.sessionId);
    authenticatedClients.delete(context.userId);
    context.userId = '';
    context.sessionId = '';
    context.response = { t: 'signOutSuccess' };
    return send(context);
  } catch (error) {
    console.log('signOut', error);
    context.response = { t: 'signOutFail' };
    return send(context);
  }
}
