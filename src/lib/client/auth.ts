import { writable } from 'svelte/store';
import { getSocket } from './ws';

export interface Auth {
  userId: string | undefined;
  sessionId: string | undefined;
  errorMessage: string | undefined;
}

const initialState: Auth = {
  userId: undefined,
  sessionId: undefined,
  errorMessage: undefined,
};

const socket = getSocket();

const store = writable<Auth>(initialState);

const localStorageKey = 'auth';

function setState(state: Auth) {
  localStorage.setItem(localStorageKey, JSON.stringify(state));
  store.set(state);
}

socket.addEventListener('message', event => {
  const data = JSON.parse(event.data);
  switch (data.type) {
    case 'signInSuccess':
    case 'resignInSuccess':
    case 'signUpSuccess': {
      return setState({
        userId: data.userId,
        sessionId: data.sessionId,
        errorMessage: undefined,
      });
    }
    case 'signOutSuccess': {
      return setState(initialState);
    }
    case 'signInFail':
    case 'resignInFail':
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
    socket.send(
      JSON.stringify({
        type: 'signIn',
        username,
        password,
      }),
    );
  },
  resignIn: (sessionId: string) => {
    socket.send(
      JSON.stringify({
        type: 'resignIn',
        sessionId,
      }),
    );
  },
  signUp: (username: string, password: string) => {
    socket.send(
      JSON.stringify({
        type: 'signUp',
        username,
        password,
      }),
    );
  },
  signOut: () => {
    socket.send(
      JSON.stringify({
        type: 'signOut',
      }),
    );
  },
};

// read store values from localStorage
const stored = localStorage.getItem(localStorageKey);
if (stored) {
  const value: Auth = JSON.parse(stored);
  store.set(value);
  socket.addEventListener('open', () => {
    if (value.userId && value.sessionId) {
      auth.resignIn(value.sessionId);
    }
  });
}
