import { join } from 'path'
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload'
import { FastifyPluginAsync, FastifyRequest, FastifyServerOptions } from 'fastify'
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware'

export interface AppOptions extends FastifyServerOptions, Partial<AutoloadPluginOptions> {}

const app: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
  /* -------------------------------------------------------------------------
  | Middlewares
  ------------------------------------------------------------------------- */
  fastify.setErrorHandler((e, r, p) => errorHandlerMiddleware(e, r, p))

  /* -------------------------------------------------------------------------
  | Load all plugins defined in the ./plugins folder.
  ------------------------------------------------------------------------- */
  fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts
  })

  /* -------------------------------------------------------------------------
  | Load all routes defined in the ./routes folder.
  ------------------------------------------------------------------------- */
  fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts
  })
}

const options: AppOptions = {
  disableRequestLogging: process.env.FASTIFY_DISABLE_REQ_LOG === 'true',
  trustProxy: true,
  logger: {
    serializers: {
      req: (req: FastifyRequest) => {
        return {
          method: req.method,
          url: req.raw?.url || req.url,
          hostname: req.hostname,
          remoteAddress: String(req.headers['x-real-ip']) || req.ip,
          remotePort: req.socket.remotePort
        }
      }
    }
  }
}

export default app
export { app, options }
