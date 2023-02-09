import type WebSocket from 'ws';

export interface BaseRequest {
  t: string;
}

export interface Context<Req = BaseRequest, Res = unknown> {
  id: string;
  socket: WebSocket;
  request: Req;
  response: Res;
  userId: string;
  sessionId: string;
}

export function send(context: Context) {
  context.socket.send(JSON.stringify(context.response));
}

/**
 * Map of all clients.
 * Key is the socket id.
 */
export const allClients = new Map<string, Context>();

/**
 * Map of authenticated clients.
 * Key is the userId.
 */
export const authenticatedClients = new Map<string, Context>();

/**
 * Map of rooms.
 * Key is the room name.
 */
export const rooms: Record<string, Map<string, Context>> = {};

/**
 * Sends a message to all clients in the room
 * @param roomName
 * @param message
 */
export function broadcastToRoom(roomName: string, message: unknown) {
  const room = rooms[roomName];
  if (room) {
    room.forEach(context => {
      context.socket.send(JSON.stringify(message));
    });
  }
}

/**
 * Sends a message to all clients
 * @param message
 */
export function broadcastToAll(message: unknown) {
  allClients.forEach(context => {
    context.socket.send(JSON.stringify(message));
  });
}
