import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';
let socket: WebSocket;

export async function getSocket(): Promise<WebSocket> {
  if (browser) {
    if (!socket) {
      const url = window.location.href.includes('localhost')
        ? 'ws://localhost:8080'
        : env.PUBLIC_WS_URL;
      socket = new WebSocket(url);
    }
    await new Promise(resolve => {
      if (socket.readyState === WebSocket.OPEN) {
        return resolve(null);
      }
      socket.addEventListener('open', () => resolve(null));
    });
    return socket;
  } else {
    throw new Error('Not in browser');
  }
}

export function send(socket: WebSocket, data: unknown) {
  socket.send(JSON.stringify(data));
}
