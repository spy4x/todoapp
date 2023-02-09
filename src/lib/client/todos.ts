import { writable } from 'svelte/store';
import { getSocket } from './ws';
import { send } from './helpers';
import type { Todo } from '@prisma/client';

export interface TodosState {
  data: Todo[];
}

const initialState: TodosState = {
  data: [],
};

const socket = getSocket();

const store = writable<TodosState>(initialState);

socket.addEventListener('message', event => {
  const data = JSON.parse(event.data);
  switch (data.t) {
    case 'todos/created': {
      return store.update(state => {
        return {
          data: [...state.data, data.data],
        };
      });
    }
  }
});

export const todos = {
  subscribe: store.subscribe,
  create: (title: string) => {
    send(socket, { t: 'todos/create', data: { title } });
  },
};
