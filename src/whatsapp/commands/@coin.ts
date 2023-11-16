import axios from 'axios'
import WAWebJS from 'whatsapp-web.js'
import { logger } from '../../utils/helpers'

export async function coin(client: WAWebJS.Client, message: WAWebJS.Message, cmd?: string) {
  const coin = message.body.replace('@', '').replace('.', '').trim().toUpperCase()

  try {
    const res = await axios.get(`https://economia.awesomeapi.com.br/${coin}`)
    const { name, bid, ask, pctChange } = res.data[0]
    const icTitle = pctChange[0] === '-' ? '📉' : '📈'
    const icVar = pctChange[0] === '-' ? '🔻' : '🔼'
    const text = `${icTitle} *${name}* ${icTitle}\n*Compra:* R$${bid}\n*Venda:* R$${ask}\n*Variação:* ${icVar} ${pctChange}%`
    return message.reply(text)
  } catch (error) {
    logger.red('@coin ERRO =>', error)
    return message.reply('Erro ao consultar moeda, tente novamente')
  }
}

export const usd = coin
export const eur = coin
