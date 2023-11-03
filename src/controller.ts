import { FastifyInstance } from "fastify";
import userRoutes from "./modules/user/user.route";
import chatRoutes from "./modules/chat/chat.route";
import authRoutes from "./modules/auth/auth.route";
import wsRoutes from "./modules/ws/ws.route";

async function defaultController(fastify: FastifyInstance) {
  fastify.register(authRoutes, { prefix: '/auth' });
  fastify.register(userRoutes, { prefix: '/user' });
  fastify.register(chatRoutes, { prefix: '/chat' });
  fastify.register(wsRoutes, { prefix: '/ws' });
}

export default defaultController;
