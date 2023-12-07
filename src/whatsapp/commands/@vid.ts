import WAWebJS, { MessageMedia } from 'whatsapp-web.js'
import youtubedl from 'youtube-dl-exec'
import { IMessageRawData } from '../../types'
import { logger } from '../../utils/helpers'
import path from 'path'
// import path from 'path'

export async function getVideoFile(url: string, quality = '(mp4)[height<480]') {
  if (url.includes('https://x.com')) {
    url.replace('https://x.com', 'https://twitter.com')
  }
  quality =
    url.includes('instagram') || url.includes('twitter') || url.includes('x.com')
      ? '(mp4)'
      : quality
  const video = await youtubedl(url, {
    format: quality,
    dumpJson: true,
    output: path.join(__dirname, '../../../public/cdn/videos/%(id)s.%(ext)s'),
    noCheckCertificates: true,
    noWarnings: true,
    addHeader: ['referer:youtube.com', 'user-agent:googlebot']
  })

  return video
}

export async function vid(client: WAWebJS.Client, message: WAWebJS.Message, cmd?: string) {
  let url = message.body.replace(`${cmd} `, '')

  const quotedMessage = (await message.getQuotedMessage())?.rawData as IMessageRawData
  url = quotedMessage?.canonicalUrl ? quotedMessage.canonicalUrl : url

  try {
    await message.reply('📼 É pra já chefe! Realizando download...')

    const video = await getVideoFile(url)
    const media = MessageMedia.fromFilePath(video._filename)

    return message.reply(media)
  } catch (error) {
    logger.red('@vid ERRO =>', error)
  }
  return message.reply('😕 Haaaa! Não consegui baixar o vídeo. O Endereço está correto?')
}
