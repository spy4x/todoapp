import type { Context } from '../../helpers';
import { usersList, usersListCommand, type UsersListRequest } from './list';

export type UsersRequest = UsersListRequest;

export function routesUsers(
  context: Context,
  request: UsersRequest,
): void | Promise<void> {
  switch (request.t) {
    case usersListCommand:
      return usersList(context);
  }
}
