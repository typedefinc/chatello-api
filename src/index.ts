import { FastifyServerOptions } from 'fastify';
import { buildApp } from "./app";

const options: FastifyServerOptions = {
  logger: true,
};

export const app = buildApp(options);

try {
  app.listen({ port: 3000, host: "192.168.31.240" });
} catch (error: unknown) {
  app.log.error(error);
  process.exit(1);
}




