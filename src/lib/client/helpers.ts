export function send(socket: WebSocket, data: unknown) {
  socket.send(JSON.stringify(data));
}
