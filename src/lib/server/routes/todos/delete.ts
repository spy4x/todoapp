import type { BaseRequest, Context } from '../../helpers';
import { broadcastToAll, sendToContext } from '../../helpers';
import type { Todo } from '@prisma/client';
import { prisma } from '../../prisma';

export const todosDeleteCommand = 'todos/delete';

export interface TodosDeleteRequest extends BaseRequest {
  t: typeof todosDeleteCommand;
  data: { id: number; title: string };
}

export type TodosDeleteResponse =
  | { t: 'todosDeleteSuccess'; data: Todo }
  | { t: 'todosDeleteFail' };

export async function todosDelete(
  context: Context,
  request: TodosDeleteRequest,
): Promise<void> {
  try {
    const { data } = request;
    const todo = await prisma.todo.delete({ where: { id: data.id } });
    const response: TodosDeleteResponse = {
      t: 'todosDeleteSuccess',
      data: todo,
    };
    sendToContext(context, response);
    broadcastToAll({ t: 'todos/deleted', data: todo });
  } catch (error) {
    console.log('todosDelete', error);
    const response: TodosDeleteResponse = { t: 'todosDeleteFail' };
    return sendToContext(context, response);
  }
}
