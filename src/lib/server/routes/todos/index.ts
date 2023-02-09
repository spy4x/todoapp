import type { Context } from '../../helpers';
import {
  todosCreate,
  todosCreateCommand,
  type TodosCreateRequest,
  type TodosCreateResponse,
} from './create';

export type TodosRequest = TodosCreateRequest;

export type TodosResponse = TodosCreateResponse;

export async function routesTodos(
  context: Context<TodosRequest, TodosResponse>,
): Promise<void> {
  switch (context.request.t) {
    case todosCreateCommand:
      return todosCreate(context);
  }
}
