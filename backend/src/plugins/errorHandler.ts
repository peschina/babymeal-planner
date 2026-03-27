import type { FastifyInstance, FastifyError, FastifyRequest, FastifyReply } from 'fastify';

export async function errorHandler(app: FastifyInstance): Promise<void> {
  app.setNotFoundHandler((_request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(404).send({
      error: {
        code: 'NOT_FOUND',
        message: 'Route not found',
      },
    });
  });

  app.setErrorHandler(
    (error: FastifyError, _request: FastifyRequest, reply: FastifyReply) => {
      const statusCode = error.statusCode ?? 500;

      app.log.error({ err: error }, error.message);

      return reply.status(statusCode).send({
        error: {
          code: error.code ?? (statusCode === 500 ? 'INTERNAL_SERVER_ERROR' : 'REQUEST_ERROR'),
          message:
            statusCode >= 500 ? 'An unexpected error occurred' : error.message,
        },
      });
    },
  );
}
