import { FastifyInstance } from "fastify";
import { getUserListHandler } from './user.controller';

async function userRoutes(fastify: FastifyInstance) {
  fastify.get('/', getUserListHandler);
}

export default userRoutes;
