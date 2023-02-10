import type { BaseRequest, Context } from '../../helpers';
import { sendToContext } from '../../helpers';
import type { Todo } from '@prisma/client';
import { prisma } from '../../prisma';

export const todosListCommand = 'todos/list';

export interface TodosListRequest extends BaseRequest {
  t: typeof todosListCommand;
}

export type TodosListResponse = { t: typeof todosListCommand; data: Todo[] };

export async function todosList(context: Context): Promise<void> {
  try {
    const todos = await prisma.todo.findMany({ orderBy: { createdAt: 'asc' } });
    const response: TodosListResponse = { t: todosListCommand, data: todos };
    return sendToContext(context, response);
  } catch (error) {
    console.error('todosList', error);
  }
}
