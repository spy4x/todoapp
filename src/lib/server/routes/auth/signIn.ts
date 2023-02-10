import { auth } from '../../lucia';
import type { BaseRequest, Context } from '../../helpers';
import { sendToContext, setUserOnline } from '../../helpers';
import { prisma } from '../../prisma';
import type { User } from '@prisma/client';

export const signInCommand = 'auth/signIn';

export interface SignInRequest extends BaseRequest {
  t: typeof signInCommand;
  username: string;
  password: string;
}

export type SignInResponse =
  | { t: 'auth/signInSuccess'; data: { sessionId: string; user: User } }
  | { t: 'auth/signInFail' };

export async function signIn(
  context: Context,
  request: SignInRequest,
): Promise<void> {
  try {
    const { username, password } = request;
    const { userId } = await auth.validateKeyPassword(
      'username',
      username,
      password,
    );
    const { sessionId } = await auth.createSession(userId);
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isOnline: true },
    });
    if (!user) {
      throw new Error('User not found');
    }
    context.userId = userId;
    context.sessionId = sessionId;
    const response: SignInResponse = {
      t: 'auth/signInSuccess',
      data: {
        sessionId: context.sessionId,
        user,
      },
    };
    sendToContext(context, response);
    void setUserOnline(context, user);
  } catch (error) {
    console.log('signIn', error);
    const response: SignInResponse = { t: 'auth/signInFail' };
    return sendToContext(context, response);
  }
}
