import type { BaseRequest, Context } from '../../helpers';
import { send } from '../../helpers';
import type { Todo } from '@prisma/client';
import { prisma } from '../../prisma';

export const todosCreateCommand = 'todosCreate';

export interface TodosCreateRequest extends BaseRequest {
  t: typeof todosCreateCommand;
  data: { title: string };
}

export type TodosCreateResponse =
  | { t: 'todosCreateSuccess'; data: Todo }
  | { t: 'todosCreateFail' };

export async function todosCreate(
  context: Context<TodosCreateRequest, TodosCreateResponse>,
): Promise<void> {
  try {
    const { data } = context.request;
    const todo = await prisma.todo.create({ data });
    context.response = { t: 'todosCreateSuccess', data: todo };
    return send(context);
  } catch (error) {
    console.log('todosCreate', error);
    context.response = { t: 'todosCreateFail' };
    return send(context);
  }
}
