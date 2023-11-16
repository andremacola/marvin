import { Static, Type } from '@sinclair/typebox'
import { RouteShorthandOptions } from 'fastify'

/* -------------------------------------------------------------------------
| REQUEST
------------------------------------------------------------------------- */

const sendMessageTokenRequestSchema = Type.Object({
  token: Type.Literal(process.env.MARVIN_TOKEN)
})

const sendMessageRequestSchema = Type.Object({
  cmd: Type.Union([Type.Literal('chat'), Type.Literal('link'), Type.Literal('media')]),
  to: Type.String(),
  msg: Type.String()
})

type SendMessageRequestType = Static<typeof sendMessageRequestSchema>

interface SendMessageInterface {
  Body: SendMessageRequestType
}

/* -------------------------------------------------------------------------
| RESPONSE
------------------------------------------------------------------------- */

const sendMessageResponseSchema = Type.Object({
  send: Type.Boolean(),
  cmd: Type.Union([Type.Literal('chat'), Type.Literal('link'), Type.Literal('media')]),
  to: Type.String()
})

/* -------------------------------------------------------------------------
| VALIDATION OPTIONS
------------------------------------------------------------------------- */
const SendMessageRouterOptions: RouteShorthandOptions = {
  prefixTrailingSlash: 'both',
  schema: {
    params: sendMessageTokenRequestSchema,
    body: sendMessageRequestSchema,
    response: {
      200: sendMessageResponseSchema
    }
  }
}

export type { SendMessageRequestType, SendMessageInterface }
export { SendMessageRouterOptions }
