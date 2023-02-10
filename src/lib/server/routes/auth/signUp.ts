import { auth } from '../../lucia';
import type { BaseRequest, Context } from '../../helpers';
import { sendToContext, setUserOnline } from '../../helpers';
import { prisma } from '../../prisma';
import type { User } from '@prisma/client';

export const signUpCommand = 'auth/signUp';

export interface SignUpRequest extends BaseRequest {
  t: typeof signUpCommand;
  username: string;
  password: string;
  photoURL?: string;
}

export type SignUpResponse =
  | { t: 'auth/signUpSuccess'; data: { sessionId: string; user: User } }
  | { t: 'auth/signUpFail' };

export async function signUp(
  context: Context,
  request: SignUpRequest,
): Promise<void> {
  try {
    const { username, password, photoURL } = request;
    const { userId } = await auth.createUser({
      key: {
        providerId: 'username',
        providerUserId: username,
        password,
      },
      attributes: {
        username,
        photoURL,
        isOnline: true,
      },
    });
    const { sessionId } = await auth.createSession(userId);
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new Error('User not found');
    }
    context.userId = userId;
    context.sessionId = sessionId;
    const response: SignUpResponse = {
      t: 'auth/signUpSuccess',
      data: {
        sessionId: context.sessionId,
        user,
      },
    };
    sendToContext(context, response);
    void setUserOnline(context, user);
  } catch (error) {
    console.log('signUp', error);
    const response: SignUpResponse = { t: 'auth/signUpFail' };
    return sendToContext(context, response);
  }
}
