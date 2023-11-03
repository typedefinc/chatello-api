import { SocketStream } from "@fastify/websocket";
import { FastifyRequest } from "fastify";
import { getChatByAddress } from "../chat/chat.service";
import { createMessage } from "./ws.service";

const rooms: Record<string, SocketStream[]> = {};

const websocketHandler = (connection: SocketStream, request: FastifyRequest<{
  Params: {
    roomId: string,
  }
}>) => {
  const roomId = request.params.roomId;

  if (rooms[roomId]) {
    rooms[roomId].push(connection);
  } else {
    rooms[roomId] = [connection];
  }

  connection.socket.on('message', async (message) => {
    const { content, chatId, userId } = JSON.parse(message.toString());
    const chat = await getChatByAddress(chatId, userId);

    if (chat) {
      const newMessage = await createMessage(chat.id, userId, content);

      rooms[roomId].forEach((duplex: SocketStream) => {
        duplex.socket.send(JSON.stringify(newMessage));
      });
    }
  });

  connection.socket.on('close', () => {
    rooms[roomId] = rooms[roomId].filter((duplex: SocketStream) => duplex !== connection);
  });
};

export {
  websocketHandler,
};
