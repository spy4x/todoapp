import { browser } from '$app/environment';
let socket: WebSocket;

export function getSocket(): WebSocket {
  if (browser) {
    if (!socket) {
      socket = new WebSocket('ws://localhost:8080');
    }
    return socket;
  } else {
    throw new Error('Not in browser');
  }
}
