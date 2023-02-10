import { authMiddleware, type Context } from '../../helpers';
import { todosList, todosListCommand, type TodosListRequest } from './list';
import {
  todosCreate,
  todosCreateCommand,
  type TodosCreateRequest,
} from './create';
import {
  todosUpdate,
  todosUpdateCommand,
  type TodosUpdateRequest,
} from './update';
import {
  todosDelete,
  todosDeleteCommand,
  type TodosDeleteRequest,
} from './delete';

export type TodosRequest =
  | TodosListRequest
  | TodosCreateRequest
  | TodosUpdateRequest
  | TodosDeleteRequest;

export function routesTodos(
  context: Context,
  request: TodosRequest,
): void | Promise<void> {
  switch (request.t) {
    case todosListCommand:
      return todosList(context);
    case todosCreateCommand:
      return authMiddleware(context, context => todosCreate(context, request));
    case todosUpdateCommand:
      return authMiddleware(context, context => todosUpdate(context, request));
    case todosDeleteCommand:
      return authMiddleware(context, context => todosDelete(context, request));
  }
}
