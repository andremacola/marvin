import WAWebJS, { MessageMedia } from 'whatsapp-web.js'
import { IMessageRawData } from '../../types'
import axios from 'axios'
import { logger } from '../../utils/helpers'

export const getShortLink = async function (url: string) {
  return axios
    .post(
      'https://api-ssl.bitly.com/v4/shorten',
      {
        group_guid: process.env.BITLY_GUID,
        domain: 'bit.ly',
        long_url: url
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ${process.env.BITLY_TOKEN}`
        }
      }
    )
    .then(r => (r.data.link ? r.data.link : false))
}

export async function pay(client: WAWebJS.Client, message: WAWebJS.Message, cmd?: string) {
  let url = message.body.replace(`${cmd} `, '')

  const quotedMessage = (await message.getQuotedMessage())?.rawData as IMessageRawData
  url = quotedMessage?.canonicalUrl ? quotedMessage.canonicalUrl : url

  try {
    const link = await getShortLink(`https://12ft.io/proxy?q=${url}`)
    const response = link ? `🗞️ *Leia*: ${link}` : 'Link inválido'

    return message.reply(response)
  } catch (error) {
    logger.red('@pay ERRO', error)
    return message.reply('😕 Haaaa! Não consegui burlar o paywall. O Endereço está correto?')
  }
}
