import Fastify, { FastifyReply, FastifyRequest, FastifyServerOptions } from "fastify";
import fastifyJwt from "@fastify/jwt";
import defaultController from "./controller";
import FastifyWebsocket from '@fastify/websocket';
import fastifyCors from "@fastify/cors";

const ROUTE_WITHOUT_AUTH = [
  '/api/auth/login',
  '/api/auth/refresh',
  '/api/auth/signup',
];

export const buildApp = (options: FastifyServerOptions) => {
  const fastify = Fastify(options);

  fastify.register(FastifyWebsocket, {
    options: {
      clientTracking: true,
    },
  });

  fastify.register(fastifyJwt, { secret: 'EcIlVdMSB2f666vQPOhJyrkiBC9tpNTBu' });

  fastify.register(defaultController, { prefix: '/api' });

  fastify.register(fastifyCors, () => (request: FastifyRequest, callback: any) => {
    callback(null, {
      origin: true,
    });
  });

  fastify.addHook("onRequest", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (ROUTE_WITHOUT_AUTH.includes(request.routeOptions.url)
        || request.routeOptions.method === 'OPTIONS'
        || request.ws) {
        return;
      }

      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  return fastify;
};
