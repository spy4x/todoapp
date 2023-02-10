import type WebSocket from 'ws';
import type { User } from '@prisma/client';
import { prisma } from './prisma';

export interface BaseRequest {
  t: string;
}

export interface Context {
  id: string;
  socket: WebSocket;
  userId: string;
  sessionId: string;
}

export function sendToContext(context: Context, message: unknown): void {
  sendToSocket(context.socket, message);
}

export function sendToSocket(
  socket: WebSocket.WebSocket,
  message: unknown,
): void {
  socket.send(JSON.stringify(message));
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

export async function setUserOnline(
  context: Context,
  user: User,
  isOnline = true,
) {
  if (isOnline) {
    authenticatedClients.set(context.userId, context);
  } else {
    authenticatedClients.delete(context.userId);
  }
  broadcastToAll({
    t: isOnline ? 'users/online' : 'users/offline',
    data: user,
  });
}

/**
 * Sends a message to all clients in the room
 * @param roomName
 * @param message
 */
export function broadcastToRoom(roomName: string, message: unknown) {
  const room = rooms[roomName];
  room && room.forEach(context => sendToContext(context, message));
}

/**
 * Sends a message to all clients
 * @param message
 */
export function broadcastToAll(message: unknown) {
  allClients.forEach(context => sendToContext(context, message));
}

export function authMiddleware(
  context: Context,
  fn: (context: Context) => void,
): void {
  if (!context.userId) {
    sendToContext(context, { t: 'auth/401' });
    return;
  }
  fn(context);
}
