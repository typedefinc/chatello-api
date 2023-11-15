import { FastifyServerOptions } from 'fastify';
import { buildApp } from "./app";

const options: FastifyServerOptions = {
  logger: true,
};

export const app = buildApp(options);
const port: number = (process.env.APP_PORT || 3000) as number;

try {
  app.listen({ port });
} catch (error: unknown) {
  app.log.error(error);
  process.exit(1);
}




