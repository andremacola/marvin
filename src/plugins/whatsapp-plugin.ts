// /* -------------------------------------------------------------------------
// | Whatsapp Server Fastify Plugin
// ------------------------------------------------------------------------- */

import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import fp from 'fastify-plugin'
import { WhatsApp } from '../whatsapp/WhatsApp'
import WAWebJS from 'whatsapp-web.js'

async function WhatsappServer(fastify: FastifyInstance, options: FastifyPluginOptions) {
  const whp = new WhatsApp(fastify)
  whp.start()

  fastify.decorate('whp', {
    client: () => whp.getClient()
  })

  process.on('SIGINT', async () => {
    fastify.log.info('Closing Whatsapp Server...')
  })
}

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    whp: {
      client: () => WAWebJS.Client
    }
  }
}

export default fp(WhatsappServer)
