import type { BaseRequest, Context } from '../helpers';
import { type AuthRequest, routesAuth } from './auth';
import { routesTodos, type TodosRequest } from './todos';
import { routesUsers, type UsersRequest } from './users';

export function router(context: Context, request: BaseRequest): void {
  void routesAuth(context, request as AuthRequest);
  void routesTodos(context, request as TodosRequest);
  void routesUsers(context, request as UsersRequest);
}
