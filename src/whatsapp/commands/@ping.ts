import WAWebJS from 'whatsapp-web.js'

export async function ping(client: WAWebJS.Client, message: WAWebJS.Message, cmd?: string) {
  return client.sendMessage(message.from, '@pong')
}
