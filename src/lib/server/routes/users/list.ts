import type { BaseRequest, Context } from '../../helpers';
import { sendToContext } from '../../helpers';
import type { User } from '@prisma/client';
import { prisma } from '../../prisma';

export const usersListCommand = 'users/list';

export interface UsersListRequest extends BaseRequest {
  t: typeof usersListCommand;
}

export type UsersListResponse = { t: typeof usersListCommand; data: User[] };

export async function usersList(context: Context): Promise<void> {
  try {
    const users = await prisma.user.findMany({
      where: { isOnline: true },
      orderBy: { username: 'asc' },
    });
    const response: UsersListResponse = { t: usersListCommand, data: users };
    return sendToContext(context, response);
  } catch (error) {
    console.error('usersList', error);
  }
}
