import { FastifyInstance } from 'fastify'
import qrcode from 'qrcode-terminal'
import WAWebJS, { Client, LocalAuth } from 'whatsapp-web.js'
import { commands } from './cmds'
import { marvinChat } from './commands/@marvin'

export class WhatsApp {
  private client!: WAWebJS.Client

  constructor(private fastify: FastifyInstance) {}

  public getClient = () => this.client

  public start() {
    this.client = !this.client
      ? new Client({
          authStrategy: new LocalAuth(),
          puppeteer: {
            channel: 'chrome',
            args: ['--no-sandbox'],
            headless: true
          }
        })
      : this.client

    this.fastify.log.info(`Initializing Whatsapp...`)
    this.client.initialize()
    this.addEvents()

    return this.client
  }

  private addEvents() {
    this.client.on('qr', qr => {
      this.fastify.log.info(`Whatsapp QR: ${qr}`)
      qrcode.generate(qr, { small: true })
    })

    this.client.on('message', message => this.handler(message))
    this.client.on('ready', () => this.fastify.log.info('Whatsapp Ready'))
  }

  private createCommand = (cmd: string, body: string) => {
    const cmdAt = `@${cmd}`
    const cmdDot = `.${cmd}`

    if (body.startsWith('talk') && cmd === 'talk') {
      return 'talk'
    }

    if (body.startsWith(cmdAt)) {
      return cmdAt
    }

    if (body.startsWith(cmdDot)) {
      return cmdDot
    }

    return undefined
  }

  private async handler(message: WAWebJS.Message) {
    const { body } = message
    const chat = await message.getChat()

    chat.sendSeen()

    for (const cmd in commands) {
      const fncmd = this.createCommand(cmd, body)

      if (fncmd) {
        chat.sendStateTyping()
        await commands[cmd as string](this.client, message, fncmd)
        return chat.clearState()
      }
    }

    if (message.type === 'chat' && !chat.isGroup && !message.broadcast && body.length > 5) {
      chat.sendStateTyping()
      await marvinChat(this.client, message)
      return chat.clearState()
    }
  }
}
