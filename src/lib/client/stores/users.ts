import { writable } from 'svelte/store';
import { getSocket, send } from '../services';
import type { User } from '@prisma/client';

export interface UsersState {
  data: User[];
}

const initialState: UsersState = {
  data: [],
};

const socket = await getSocket();

const store = writable<UsersState>(initialState);

/**
 * Sort users by online and then by username
 * @param a
 * @param b
 */
function sortUsers(a: User, b: User): number {
  if (a.isOnline && !b.isOnline) {
    return -1;
  }
  if (!a.isOnline && b.isOnline) {
    return 1;
  }
  if (a.username < b.username) {
    return -1;
  }
  if (a.username > b.username) {
    return 1;
  }
  return 0;
}

socket.addEventListener('message', event => {
  const data = JSON.parse(event.data);
  switch (data.t) {
    case 'users/list': {
      return store.set({ data: data.data });
    }
    case 'users/online': {
      console.log('online', data);
      return store.update(state => {
        let userExists = false;
        const updatedData = state.data.map(user => {
          if (user.id === data.data.id) {
            userExists = true;
            return { ...user, isOnline: true };
          }
          return user;
        });
        if (userExists) {
          return {
            data: updatedData.sort(sortUsers),
          };
        }
        // TODO: sort by online and then by username
        return {
          data: [...state.data, data.data].sort(sortUsers),
        };
      });
    }
    case 'users/offline': {
      console.log('offline', data);
      return store.update(state => {
        return {
          data: state.data
            .map(user => {
              if (user.id === data.data.id) {
                return { ...user, isOnline: false };
              }
              return user;
            })
            .sort(sortUsers),
        };
      });
    }
  }
});

send(socket, { t: 'users/list' });

export const users = {
  subscribe: store.subscribe,
};
