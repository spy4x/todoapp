import { auth } from '../../lucia';
import type { BaseRequest, Context } from '../../helpers';
import { sendToContext, setUserOnline } from '../../helpers';
import { prisma } from '../../prisma';
import type { User } from '@prisma/client';

export const reSignInCommand = 'auth/reSignIn';

export interface ReSignInRequest extends BaseRequest {
  t: typeof reSignInCommand;
  sessionId: string;
}

export type ReSignInResponse =
  | { t: 'auth/reSignInSuccess'; data: { sessionId: string; user: User } }
  | { t: 'auth/reSignInFail' };

export async function reSignIn(
  context: Context,
  request: ReSignInRequest,
): Promise<void> {
  try {
    const { sessionId } = request;
    const session = await auth.validateSession(sessionId);
    const user = await prisma.user.update({
      where: { id: session.userId },
      data: { isOnline: true },
    });
    if (!user) {
      throw new Error('User not found');
    }
    context.userId = session.userId;
    context.sessionId = session.sessionId;
    const response: ReSignInResponse = {
      t: 'auth/reSignInSuccess',
      data: {
        sessionId: context.sessionId,
        user,
      },
    };
    sendToContext(context, response);
    void setUserOnline(context, user);
  } catch (error) {
    console.log('reSignIn', error);
    const response: ReSignInResponse = { t: 'auth/reSignInFail' };
    return sendToContext(context, response);
  }
}
