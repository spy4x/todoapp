import type { BaseRequest, Context } from '../../helpers';
import { broadcastToAll, sendToContext } from '../../helpers';
import type { Todo } from '@prisma/client';
import { prisma } from '../../prisma';

export const todosCreateCommand = 'todos/create';

export interface TodosCreateRequest extends BaseRequest {
  t: typeof todosCreateCommand;
  data: { title: string };
}

export type TodosCreateResponse =
  | { t: 'todosCreateSuccess'; data: Todo }
  | { t: 'todosCreateFail' };

async function todosCreate(
  context: Context,
  request: TodosCreateRequest,
): Promise<void> {
  try {
    const { data } = request;
    const todo = await prisma.todo.create({ data });
    const response: TodosCreateResponse = {
      t: 'todosCreateSuccess',
      data: todo,
    };
    sendToContext(context, response);
    broadcastToAll({ t: 'todos/created', data: todo });
  } catch (error) {
    console.log('todosCreate', error);
    const response: TodosCreateResponse = { t: 'todosCreateFail' };
    return sendToContext(context, response);
  }
}

export { todosCreate };
