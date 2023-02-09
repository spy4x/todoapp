import { WebSocketServer } from 'ws';
import { getEnv } from './config';
import { routesAuth } from './routes/auth';
import type { Context } from './helpers';
import { allClients, authenticatedClients, broadcastToAll } from './helpers';
import { routesTodos } from './routes/todos';
import { init } from '@paralleldrive/cuid2';
import { prisma } from './prisma';

const cuid = init({ length: 5 });

function startWSServer() {
  const port = +getEnv('PORT');
  const server = new WebSocketServer({ port });

  server.on('listening', () => {
    console.log(`WebSocketServer listening on port ${port}`);

    let todoIndex = 0;
    setInterval(async () => {
      console.log('allClients', allClients.size);
      console.log('authenticatedClients', authenticatedClients.size);
      const todo = await prisma.todo.create({
        data: {
          title: `Todo ${++todoIndex}`,
        },
      });
      broadcastToAll({ t: 'todos/created', data: todo });
    }, 10000);
  });

  server.on('connection', socket => {
    const context: Context = {
      id: cuid(),
      socket,
      request: { t: '' }, // TODO: move to outer object to avoid race conditions
      response: null, // TODO: move to outer object to avoid race conditions
      userId: '',
      sessionId: '',
    };
    allClients.set(context.id, context);

    socket.on('error', console.error);

    socket.on('close', () => {
      allClients.delete(context.id);
      if (context.userId) {
        authenticatedClients.delete(context.userId);
      }
    });

    socket.on('message', async (data: string) => {
      console.log('Received: %s', data);
      let json: any; // TODO: Type this
      try {
        json = JSON.parse(data);
      } catch {
        console.log('Warning: Not json %s', data);
        socket.send(JSON.stringify({ m: 'v/json' }));
        return;
      }
      context.request = json;
      context.response = null;
      void routesAuth(context);
      void routesTodos(context);
    });
  });

  return server;
}

export function wsServerPlugin() {
  return {
    name: 'multiplayer',
    configureServer: (server: any) => {
      const wss = startWSServer();

      server.httpServer.on('close', () => {
        wss.close();
      });
    },
  };
}
