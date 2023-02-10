import type { BaseRequest, Context } from '../../helpers';
import { broadcastToAll, sendToContext } from '../../helpers';
import type { Todo } from '@prisma/client';
import { prisma } from '../../prisma';

export const todosUpdateCommand = 'todos/update';

export interface TodosUpdateRequest extends BaseRequest {
  t: typeof todosUpdateCommand;
  data: { id: number; title: string };
}

export type TodosUpdateResponse =
  | { t: 'todosUpdateSuccess'; data: Todo }
  | { t: 'todosUpdateFail' };

export async function todosUpdate(
  context: Context,
  request: TodosUpdateRequest,
): Promise<void> {
  try {
    const { data } = request;
    const todo = await prisma.todo.update({ where: { id: data.id }, data });
    const response: TodosUpdateResponse = {
      t: 'todosUpdateSuccess',
      data: todo,
    };
    sendToContext(context, response);
    broadcastToAll({ t: 'todos/updated', data: todo });
  } catch (error) {
    console.log('todosUpdate', error);
    const response: TodosUpdateResponse = { t: 'todosUpdateFail' };
    return sendToContext(context, response);
  }
}
