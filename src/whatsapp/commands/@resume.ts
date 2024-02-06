import axios from 'axios'
import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources/index.mjs'
import WAWebJS from 'whatsapp-web.js'
import { chatDefaultOptions, openAIClient } from '../../clients/openai'
import { logger } from '../../utils/helpers'

const openai = openAIClient.getInstance()

export const extractArticle = async function (url: string) {
  return axios
    .post(
      process.env.EXTRACT_ARTICLE_API_URL,
      {
        url
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
    .then(r => (r.data ? r.data.title + ' ' + r.data.content : false))
    .catch(err => console.log('@resume extractArticle ERRO =>', err))
}

export async function resume(client: WAWebJS.Client, message: WAWebJS.Message, cmd?: string) {
  const { from, body, author } = message
  const sourceUrl = body.replace(`${cmd} `, '')
  const returnMSG = ''

  if (!sourceUrl.startsWith('https')) {
    return await message.reply('Desculpe, endereço inválido.')
  }

  try {
    const post = await extractArticle(sourceUrl)

    if (post) {
      let marvinResponse = ''
      const template =
        'Toda mensagem deve ser respondida com um resumo do texto enviado, de forma sucinta, clara e direta. Sempre menor que o texto original. O resumo deve ser em português brasileiro, independentemente do idioma do texto original.\n'
      const chatOptions: Partial<ChatCompletionCreateParamsNonStreaming> = {
        user: from,
        messages: [
          { role: 'system', content: template },
          {
            role: 'user',
            content: post
          }
        ]
      }

      const response = await openai.chat.completions.create({
        ...chatDefaultOptions,
        ...chatOptions
      })

      response.choices.forEach(({ message }) => (marvinResponse += message.content))

      logger.info(
        `@marvinResume => [${author ? `${from} -> ${author}` : from}] ${sourceUrl}`,
        JSON.stringify(response.usage)
      )

      return message.reply(marvinResponse)
    } else {
      return message.reply(`Erro ao tentar ler o artigo. Tente novamente mais tarde.`)
    }
  } catch (error) {
    logger.red(`@marvinResume ERRO  => ${error}`)
  }

  return message.reply(`Infelizmente não consegui criar um resumo neste momento 😔`)
}
