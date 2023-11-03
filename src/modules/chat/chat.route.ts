import { FastifyInstance } from "fastify";
import { getRoomInfoHandler, createChatHandler, getChatsHandler, getMessagesList } from "./chat.controller";

async function chatRoutes(fastify: FastifyInstance) {
  fastify.post('/', createChatHandler);
  fastify.get('/', getChatsHandler);
  fastify.get('/:chat/ticket', getRoomInfoHandler);
  fastify.get('/:chat/messages', getMessagesList);
}

export default chatRoutes;
