import { FastifyInstance } from "fastify";
import { loginHandler, refreshHandler, signupHandler, userDataHandler } from "./auth.controller";

async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/login', loginHandler);
  fastify.post('/refresh', refreshHandler);
  fastify.post('/signup', signupHandler);
  fastify.get('/user', userDataHandler);
}

export default authRoutes;
