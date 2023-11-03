import { FastifyInstance } from "fastify";
import { websocketHandler } from "./ws.controller";

async function wsRoutes(fastify: FastifyInstance) {
  fastify.get('/:roomId', { websocket: true }, websocketHandler);
}

export default wsRoutes;
