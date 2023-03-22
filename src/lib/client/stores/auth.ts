import { writable } from 'svelte/store';
import { getSocket, send } from '../services';
import type { User } from '@prisma/client';

export interface AuthState {
  sessionId: string | undefined;
  user: User | undefined;
  errorMessage: string | undefined;
}

const initialState: AuthState = {
  sessionId: undefined,
  user: undefined,
  errorMessage: undefined,
};

const socket = await getSocket();

const store = writable<AuthState>(initialState);

const localStorageKey = 'auth';

function setState(state: AuthState) {
  localStorage.setItem(localStorageKey, JSON.stringify(state));
  store.set(state);
}

socket.addEventListener('message', event => {
  const response = JSON.parse(event.data);
  console.log('auth', response);
  switch (response.t) {
    case 'auth/signInSuccess':
    case 'auth/reSignInSuccess':
    case 'auth/signUpSuccess': {
      return setState({
        sessionId: response.data.sessionId,
        user: response.data.user,
        errorMessage: undefined,
      });
    }
    case 'auth/signOutSuccess': {
      return setState(initialState);
    }
    case 'auth/signInFail':
    case 'auth/reSignInFail':
    case 'auth/signUpFail':
    case 'auth/signOutFail': {
      return setState({
        sessionId: undefined,
        user: undefined,
        errorMessage: response.message,
      });
    }
  }
});

export const auth = {
  subscribe: store.subscribe,
  signIn: (username: string, password: string) => {
    send(socket, { t: 'auth/signIn', username, password });
  },
  resignIn: (sessionId: string) => {
    send(socket, { t: 'auth/reSignIn', sessionId });
  },
  signUp: (username: string, password: string, photoURL?: string) => {
    send(socket, { t: 'auth/signUp', username, password, photoURL });
  },
  signOut: () => {
    send(socket, { t: 'auth/signOut' });
  },
  deleteUser: (id: string) => {
    send(socket, { t: 'auth/deleteUser', data: { id } });
  },
};

// read store values from localStorage
const stored = localStorage.getItem(localStorageKey);
if (stored) {
  const value: AuthState = JSON.parse(stored);
  store.set(value);
  if (value.user && value.sessionId) {
    auth.resignIn(value.sessionId);
  }
}
