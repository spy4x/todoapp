import { auth } from '../../lucia';
import type { BaseRequest, Context } from '../../helpers';
import { setUserOnline, sendToContext } from '../../helpers';
import { prisma } from '../../prisma';
import type { User } from '@prisma/client';

export const deleteUserCommand = 'auth/deleteUser';

export interface DeleteUserRequest extends BaseRequest {
  t: typeof deleteUserCommand;
  data: { id: string };
}

export type DeleteUserResponse =
  | { t: 'auth/deleteUserSuccess'; data: User }
  | { t: 'auth/deleteUserFail' };

export async function deleteUser(
  context: Context,
  request: DeleteUserRequest,
): Promise<void> {
  try {
    await auth.invalidateSession(context.sessionId);
    const { data } = request;
    const user = await prisma.user.delete({ where: { id: data.id } });
    if (!user) {
      throw new Error('User not found');
    }
    void setUserOnline(context, user, false);
    context.userId = '';
    context.sessionId = '';
    const response: DeleteUserResponse = {
      t: 'auth/deleteUserSuccess',
      data: user,
    };
    sendToContext(context, response);
  } catch (error) {
    console.log('deleteUser', error);
    const response: DeleteUserResponse = { t: 'auth/deleteUserFail' };
    return sendToContext(context, response);
  }
}
