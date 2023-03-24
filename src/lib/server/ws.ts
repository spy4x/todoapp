import { WebSocketServer } from 'ws';
import { getEnv } from './config';
import type { Context } from './helpers';
import { allClients, authenticatedClients, setUserOnline } from './helpers';
import { init } from '@paralleldrive/cuid2';
import { prisma } from './prisma';
import { router } from './routes';

const cuid = init({ length: 5 });

function startWSServer() {
  const port = +getEnv('PORT');
  const server = new WebSocketServer({ port });
  let logInterval = 0;

  server.on('listening', () => {
    console.log(`WebSocketServer listening on port ${port}`);

    // @ts-ignore
    logInterval = setInterval(async () => {
      console.log(`clients`, {
        all: allClients.size,
        authenticated: authenticatedClients.size,
      });
    }, 10000);
  });

  server.on('close', () => {
    console.log(`WebSocketServer closed`);
    clearInterval(logInterval);
  });

  server.on('connection', socket => {
    const context: Context = {
      id: cuid(),
      socket,
      userId: '',
      sessionId: '',
    };
    allClients.set(context.id, context);

    socket.on('error', console.error);

    socket.on('close', async () => {
      allClients.delete(context.id);
      if (context.userId) {
        const user = await prisma.user.findUnique({
          where: { id: context.userId },
        });
        if (user) {
          void setUserOnline(context, user, false);
        }
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
      router(context, json);
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
