import { writable } from 'svelte/store';
import { getSocket } from './ws';
import { send } from './helpers';

export interface AuthState {
  userId: string | undefined;
  sessionId: string | undefined;
  errorMessage: string | undefined;
}

const initialState: AuthState = {
  userId: undefined,
  sessionId: undefined,
  errorMessage: undefined,
};

const socket = getSocket();

const store = writable<AuthState>(initialState);

const localStorageKey = 'auth';

function setState(state: AuthState) {
  localStorage.setItem(localStorageKey, JSON.stringify(state));
  store.set(state);
}

socket.addEventListener('message', event => {
  const data = JSON.parse(event.data);
  switch (data.t) {
    case 'signInSuccess':
    case 'reSignInSuccess':
    case 'signUpSuccess': {
      return setState({
        userId: data.u,
        sessionId: data.s,
        errorMessage: undefined,
      });
    }
    case 'signOutSuccess': {
      return setState(initialState);
    }
    case 'signInFail':
    case 'reSignInFail':
    case 'signUpFail':
    case 'signOutFail': {
      return setState({
        userId: undefined,
        sessionId: undefined,
        errorMessage: data.message,
      });
    }
  }
});

export const auth = {
  subscribe: store.subscribe,
  signIn: (username: string, password: string) => {
    send(socket, { t: 'signIn', username, password });
  },
  resignIn: (sessionId: string) => {
    send(socket, { t: 'reSignIn', sessionId });
  },
  signUp: (username: string, password: string) => {
    send(socket, { t: 'signUp', username, password });
  },
  signOut: () => {
    send(socket, { t: 'signOut' });
  },
};

// read store values from localStorage
const stored = localStorage.getItem(localStorageKey);
if (stored) {
  const value: AuthState = JSON.parse(stored);
  store.set(value);
  socket.addEventListener('open', () => {
    if (value.userId && value.sessionId) {
      auth.resignIn(value.sessionId);
    }
  });
}
