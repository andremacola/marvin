import WAWebJS, { MessageMedia } from 'whatsapp-web.js'
import { chatHistory, chatDefaultOptions, openAIClient, talkOptions } from '../../clients/openai'
import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources/index.mjs'
import { logger } from '../../utils/helpers'

const openai = openAIClient.getInstance()
const vips = process.env.WA_VIP_NUMBERS.split(' ')

/* -------------------------------------------------------------------------
| Standard/Default Command for Marvin Chat
------------------------------------------------------------------------- */
export async function marvinChat(client: WAWebJS.Client, message: WAWebJS.Message, cmd?: string) {
  message.body = message.body.replace(`${cmd} `, '').replace(`@${process.env.MARVIN_NUMBER} `, '')
  const isMention = (await message.getMentions()).length

  if (message.body.toLowerCase().startsWith('talk ')) {
    return marvinTalk(client, message)
  }

  const text = await marvin(client, message)

  if (isMention) {
    return message.reply(text)
  }

  return client.sendMessage(message.from, text)
}

/* -------------------------------------------------------------------------
| @talk Command for Marvin to Speak
------------------------------------------------------------------------- */
export async function marvinTalk(client: WAWebJS.Client, message: WAWebJS.Message, cmd?: string) {
  message.body = message.body.replace(`${cmd} `, '')
  const { from } = message
  const chat = await message.getChat()
  const isMention = (await message.getMentions()).length
  const text = await marvin(client, message, true)

  try {
    const audio = await openai.audio.speech.create({ ...talkOptions, input: text })
    const buffer = Buffer.from(await audio.arrayBuffer()).toString('base64')

    if (audio !== null) {
      chat.sendStateRecording()
      const ptt = new MessageMedia('audio/ogg; codecs=opus', buffer)

      if (isMention) {
        return message.reply(ptt, undefined, { sendAudioAsVoice: true })
      }

      return client.sendMessage(from, ptt, { sendAudioAsVoice: true })
    }
  } catch (error) {
    logger.red('@talk ERRO =>', error)
  }

  return message.reply(
    'Parece que estou sem voz no momento, vou tomar um chá. Me chama daqui a pouco.'
  )
}

/* -------------------------------------------------------------------------
| Core Method from OpenAI Request for Marvin
------------------------------------------------------------------------- */
export async function marvin(client: WAWebJS.Client, message: WAWebJS.Message, isAudio = false) {
  const { from, body, author } = message
  const question = body.match(/(\.|\?|:|!)$/) ? body : `${body}.` // adiciona pontuação se não tiver
  const persona =
    from === process.env.WA_MAFIA_GROUP && isAudio
      ? process.env.MARVIN_IA_PERSONA_MA
      : process.env.MARVIN_IA_PERSONA

  if (question.length > 500 && !vips.includes(from)) {
    return '😤 Haa não vou ler esse textão não. Da uma resumida aí. 😅'
  }

  try {
    let marvinResponse = ''
    chatHistory[from] = chatHistory[from] || [{ role: 'system', content: persona }]
    chatHistory[from].push({ role: 'user', content: question })
    const chatOptions: Partial<ChatCompletionCreateParamsNonStreaming> = {
      user: from,
      messages: chatHistory[from]
    }

    const response = await openai.chat.completions.create({ ...chatDefaultOptions, ...chatOptions })
    response.choices.forEach(({ message }) => {
      chatHistory[from].push({ role: 'assistant', content: message.content })
      marvinResponse += message.content
    })

    /* manter somente as 2 últimas interações */
    chatHistory[from] = [chatHistory[from][0], ...chatHistory[from].slice(-2)]

    logger.info(
      `@marvinChat => [${author ? `${from} -> ${author}` : from}] ${question}`,
      JSON.stringify(response.usage)
    )

    return marvinResponse.trim()
  } catch (error) {
    logger.info('@marvinChat ERRO =>', from, error)
    return 'Infelizmente não vou conseguir te responder agora. Tente novamente mais tarde.'
  }
}

export function marvinReset(client: WAWebJS.Client, message: WAWebJS.Message) {
  delete chatHistory[message.from]
  return message.reply('Chat resetado com sucesso.')
}
