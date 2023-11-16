import fastify, { FastifyError, FastifyReply, FastifyRequest } from 'fastify'

export function errorHandlerMiddleware(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const statusCode = error.statusCode || 400
  // const fastify = request.server

  if (error.message.startsWith('params/token must be equal to constant')) {
    error.message = 'Invalid token.'
  }

  if (error.message.startsWith('querystring')) {
    error.message = 'Invalid querystring.'
  }

  if (error.validation && error.validation[0].instancePath === '/event') {
    error.message = 'Valid event is required.'
  }

  // else {
  //   fastify.log.error(error.message)
  //   fastify.log.error(error.validation)
  // }

  return reply.status(statusCode).send({ error: error.message })
}
