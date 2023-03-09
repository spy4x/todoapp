import { writable } from 'svelte/store';
import { getSocket, send } from '../services';
import type { Todo } from '@prisma/client';

export interface TodosState {
  data: Todo[];
}

const initialState: TodosState = {
  data: [],
};

const socket = await getSocket();

const store = writable<TodosState>(initialState);

socket.addEventListener('message', event => {
  const data = JSON.parse(event.data);
  switch (data.t) {
    case 'todos/list': {
      return store.set({ data: data.data });
    }
    case 'todos/created': {
      return store.update(state => {
        return {
          data: [...state.data, data.data],
        };
      });
    }
    case 'todos/deleted': {
      return store.update(state => {
        return {
          data: state.data.filter(todo => todo.id !== data.data.id),
        };
      });
    }
  }
});

send(socket, { t: 'todos/list' });

export const todos = {
  subscribe: store.subscribe,
  create: (title: string) => {
    send(socket, { t: 'todos/create', data: { title } });
  },
  update: (id: number, title: string) => {
    send(socket, { t: 'todos/create', data: { id, title } });
  },
  delete: (id: number) => {
    send(socket, { t: 'todos/delete', data: { id } });
  },
};
