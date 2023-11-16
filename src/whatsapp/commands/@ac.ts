import axios from 'axios'
import WAWebJS from 'whatsapp-web.js'
import { logger } from '../../utils/helpers'

export async function ac(client: WAWebJS.Client, message: WAWebJS.Message, cmd?: string) {
  const stock = message.body.replace(`${cmd} `, '').toUpperCase()

  if (stock.length > 1) {
    try {
      const options = {
        method: 'GET',
        url: 'https://yh-finance.p.rapidapi.com/market/v2/get-quotes',
        params: {
          region: 'BR',
          symbols: `${stock}.SA`
        },
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com'
        }
      }
      const res = await axios.request(options)
      const { longName, symbol, regularMarketPrice, regularMarketChange } =
        res.data.quoteResponse.result[0]
      const icTitle = regularMarketChange < 0 ? '📉' : '📈'
      const icVar = regularMarketChange < 0 ? '🔻' : '🔼'
      const text = `${icTitle} *${longName}* ${icTitle}\n*ID:* ${symbol}\n*Preço:* ${icVar} R$${regularMarketPrice}\n*Variação:* ${icVar} ${regularMarketChange}%`

      return message.reply(text)
    } catch (error) {
      logger.red('@ac ERRO =>', error)
      return message.reply('Erro ao consultar ou ação inválida, tente novamente')
    }
  }

  return message.reply('Informe uma ação para consulta')
}
