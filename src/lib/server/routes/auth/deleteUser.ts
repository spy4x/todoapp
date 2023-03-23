import { auth } from '../../lucia';
import type { BaseRequest, Context } from '../../helpers';
import { setUserOnline, sendToContext } from '../../helpers';
import { prisma } from '../../prisma';

export const deleteUserCommand = 'auth/deleteUser';

export interface DeleteUserRequest extends BaseRequest {
  t: typeof deleteUserCommand;
  data: { id: string };
}

export type DeleteUserResponse =
  | { t: 'auth/deleteUserSuccess' }
  | { t: 'auth/deleteUserFail' };

export async function deleteUser(context: Context): Promise<void> {
  try {
    await auth.invalidateSession(context.sessionId);
    const user = await prisma.user.delete({ where: { id: context.userId } });
    if (!user) {
      throw new Error('User not found');
    }
    void setUserOnline(context, user, false);
    context.userId = '';
    context.sessionId = '';
    const response: DeleteUserResponse = {
      t: 'auth/deleteUserSuccess',
    };
    sendToContext(context, response);
  } catch (error) {
    console.log('deleteUser', error);
    const response: DeleteUserResponse = { t: 'auth/deleteUserFail' };
    return sendToContext(context, response);
  }
}
