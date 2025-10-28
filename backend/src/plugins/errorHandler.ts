import type { FastifyInstance, FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { AppError } from '../utils/errors';

function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({ message: error.message });
  }

  request.log.error(error);

  return reply.status(500).send({ message: 'Internal Server Error' });
}

export default fp(async function(server: FastifyInstance) {
  server.setErrorHandler(errorHandler);
});
