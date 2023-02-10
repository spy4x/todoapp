import { auth } from '../../lucia';
import type { BaseRequest, Context } from '../../helpers';
import { sendToContext, setUserOnline } from '../../helpers';
import { prisma } from '../../prisma';

export const signOutCommand = 'auth/signOut';

export interface SignOutRequest extends BaseRequest {
  t: typeof signOutCommand;
}

export type SignOutResponse =
  | { t: 'auth/signOutSuccess' }
  | { t: 'auth/signOutFail' };

export async function signOut(context: Context): Promise<void> {
  try {
    await auth.invalidateSession(context.sessionId);
    const user = await prisma.user.update({
      where: { id: context.userId },
      data: { isOnline: false },
    });
    if (!user) {
      throw new Error('User not found');
    }
    void setUserOnline(context, user, false);
    context.userId = '';
    context.sessionId = '';
    const response: SignOutResponse = { t: 'auth/signOutSuccess' };
    sendToContext(context, response);
  } catch (error) {
    console.log('signOut', error);
    const response: SignOutResponse = { t: 'auth/signOutFail' };
    return sendToContext(context, response);
  }
}
