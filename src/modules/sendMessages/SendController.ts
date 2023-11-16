import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { SendMessageInterface, SendMessageRequestType } from './sendSchema'
import WAWebJS from 'whatsapp-web.js'

class SendMessageController {
  private cmd: SendMessageRequestType['cmd']
  private to: string
  private msg: string
  private whp: WAWebJS.Client
  private fastify: FastifyInstance

  constructor(
    private request: FastifyRequest<SendMessageInterface>,
    private reply: FastifyReply
  ) {
    this.fastify = request.server
    this.cmd = request.body.cmd
    this.to = this.parseBRNumber(request.body.to)
    this.msg = request.body.msg
    this.whp = request.server.whp.client()
  }

  public handler = () => this[this.cmd]()

  private parseBRNumber(n: string) {
    if (n.charAt(4) == '9' && n.slice(0, 2) == '55') {
      return n.slice(0, 4) + n.slice(5)
    }
    return n
  }

  private async chat() {
    try {
      await this.whp.sendMessage(this.to, this.msg)
      return this.reply.send({ send: true, to: this.to, cmd: this.cmd })
    } catch (error) {
      this.fastify.log.error(`SendMessager Error: ${error}`)
      return this.reply.send({ send: false, to: this.to, cmd: this.cmd })
    }
  }

  private link() {
    return this.reply.send({ status: 'success' })
  }

  private media() {
    return this.reply.send({ status: 'success' })
  }
}

export const SendMessageControllerInstance = (
  request: FastifyRequest<SendMessageInterface>,
  reply: FastifyReply
) => new SendMessageController(request, reply).handler()
