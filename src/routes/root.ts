import { FastifyPluginAsync } from 'fastify'
import { SendMessageControllerInstance } from '../modules/sendMessages/SendController'
import { SendMessageInterface, SendMessageRouterOptions } from '../modules/sendMessages/sendSchema'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post<SendMessageInterface>(
    '/:token/send',
    SendMessageRouterOptions,
    SendMessageControllerInstance
  )
  fastify.get('/', (req, reply) => reply.send({ status: 'online' }))
}

export default root
