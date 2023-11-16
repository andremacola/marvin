import WAWebJS, { MessageMedia } from 'whatsapp-web.js'
import { dalleOptions, openAIClient } from '../../clients/openai'
import { logger } from '../../utils/helpers'

const openai = openAIClient.getInstance()
const vips = process.env.WA_VIP_NUMBERS.split(' ')

/* -------------------------------------------------------------------------
| Core Method from OpenAI Request for Marvin/Dalle
------------------------------------------------------------------------- */
export async function dalle(client: WAWebJS.Client, message: WAWebJS.Message) {
  const { from, body, author } = message

  if (!vips.includes(author ? author : from)) {
    return message.reply('A função *@img* somente pode ser usada por membros premium')
  }

  const question = body.replace('@img ', '').replace('@dalle ', '')
  let dalleImageUrl

  try {
    const response = await openai.images.generate({ ...dalleOptions, prompt: question })
    dalleImageUrl = response.data[0].url
  } catch (error) {
    logger.info(`@dalle ERRO => ${error}`)
  }

  if (dalleImageUrl && dalleImageUrl.length) {
    logger.info(`@marvinDalle => [${author ? `${from} -> ${author}` : from}] ${question}`)
    const image = await MessageMedia.fromUrl(dalleImageUrl)
    return await message.reply(image, undefined, { caption: question })
  }

  return message.reply(
    '😕 Haaaa! Não consegui gerar a imagem no momento. Tente no novamente mais tarde.'
  )
}
