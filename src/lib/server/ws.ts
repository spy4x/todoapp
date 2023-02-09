import WebSocket, { WebSocketServer } from 'ws';
import { auth } from './lucia';

function subscribeToStream(client: WebSocket.WebSocket) {
  let index = 0;
  const interval = setInterval(() => {
    if (index >= 5) {
      clearInterval(interval);
      return;
    }
    client.send(JSON.stringify({ index: ++index }));
  }, 1000);
}

function startWSServer() {
  const port = 8080;
  const server = new WebSocketServer({ port });

  server.on('listening', () => {
    console.log(`WebSocketServer listening on port ${port}`);
  });

  server.on('connection', client => {
    let userId: string | undefined = undefined;

    function getUserId(): string {
      if (!userId) {
        throw new Error('Not signed in');
      }
      return userId;
    }

    let sessionId: string | undefined = undefined;

    function getSessionId(): string {
      if (!sessionId) {
        throw new Error('Not signed in');
      }
      return sessionId;
    }

    client.on('error', error => console.error('WebSocketServer Error:', error));

    client.on('close', async () => {
      userId = undefined;
      sessionId = undefined;
    });

    client.on('message', async (data: string) => {
      console.log('received: %s', data);
      let json: any;
      try {
        json = JSON.parse(data);
      } catch (e) {
        console.log('Warning: Not json', data);
        client.send(JSON.stringify({ error: 'Not json' }));
        return;
      }
      switch (json.type) {
        case 'ping': {
          client.send(JSON.stringify({ type: 'pong', userId, sessionId }));
          return;
        }
        case 'subscribe': {
          subscribeToStream(client);
          return;
        }
        case 'signUp': {
          try {
            const { username, password } = json;
            ({ userId } = await auth.createUser({
              key: {
                providerId: 'username',
                providerUserId: username,
                password,
              },
              attributes: {},
            }));
            const session = await auth.createSession(getUserId());
            sessionId = session.sessionId;
            return client.send(
              JSON.stringify({
                type: 'signUpSuccess',
                userId,
                sessionId: session.sessionId,
              }),
            );
          } catch (error) {
            console.log(error);
            return client.send(
              JSON.stringify({
                type: 'signUpFail',
                message: 'Something went wrong',
              }),
            );
          }
        }

        case 'signIn': {
          const { username, password } = json;
          try {
            ({ userId } = await auth.validateKeyPassword(
              'username',
              username,
              password,
            ));
            const session = await auth.createSession(getUserId());
            sessionId = session.sessionId;
            return client.send(
              JSON.stringify({
                type: 'signInSuccess',
                userId,
                sessionId: session.sessionId,
              }),
            );
          } catch (error) {
            console.log(error);
            return client.send(
              JSON.stringify({
                type: 'signInFail',
                message: 'There are no such username and password combination',
              }),
            );
          }
        }

        case 'resignIn': {
          const { sessionId: clientSessionId } = json;
          try {
            const session = await auth.validateSession(clientSessionId);
            userId = session.userId;
            sessionId = session.sessionId;
            return client.send(
              JSON.stringify({
                type: 'resignInSuccess',
                userId,
                sessionId: session.sessionId,
              }),
            );
          } catch (error) {
            console.log('resignin failed:', error);
            return client.send(
              JSON.stringify({
                type: 'resignInFail',
                message: 'Something went wrong',
              }),
            );
          }
        }

        case 'signOut': {
          try {
            await auth.invalidateSession(getSessionId());
            return client.send(
              JSON.stringify({
                type: 'signOutSuccess',
              }),
            );
          } catch (error) {
            console.log(error);
            return client.send(
              JSON.stringify({
                type: 'signOutFail',
                message: 'Something went wrong',
              }),
            );
          }
        }
      }
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
