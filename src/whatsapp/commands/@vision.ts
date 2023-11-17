import WAWebJS, { MessageMedia } from 'whatsapp-web.js'
import { chatDefaultOptions, openAIClient } from '../../clients/openai'
import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources/index.mjs'
import { logger } from '../../utils/helpers'

const openai = openAIClient.getInstance()
const vips = process.env.WA_VIP_NUMBERS.split(' ')

/* -------------------------------------------------------------------------
| Core Method from OpenAI Request for Marvin/Vision
------------------------------------------------------------------------- */
export async function vision(client: WAWebJS.Client, message: WAWebJS.Message, cmd?: string) {
  const { from, body, author } = message

  if (!vips.includes(author ? author : from)) {
    return message.reply('A função *@img* somente pode ser usada por membros premium')
  }

  const question = body.replace(`${cmd} `, '')
  const imageUrl = question.split(' ')[0]
  const chatOptions: Partial<ChatCompletionCreateParamsNonStreaming> = {
    user: from,
    messages: [
      { role: 'system', content: process.env.MARVIN_IA_PERSONA },
      {
        role: 'user',
        content: [
          { type: 'text', text: question },
          { type: 'image_url', image_url: { url: imageUrl } }
        ]
      }
    ]
  }

  if (!imageUrl) {
    return message.reply('Imagem inválida para análise')
  }

  try {
    let marvinResponse = ''
    const response = await openai.chat.completions.create({ ...chatDefaultOptions, ...chatOptions })
    response.choices.forEach(({ message }) => (marvinResponse += message.content))

    logger.info(
      `@marvinVision => [${author ? `${from} -> ${author}` : from}] ${question}`,
      JSON.stringify(response.usage)
    )

    return message.reply(marvinResponse)
  } catch (error) {
    logger.red('@vision ERRO =>', error)
  }

  return message.reply(`Infelizmente não consigo te responder agora. Tente novamente mais tarde.`)
}
