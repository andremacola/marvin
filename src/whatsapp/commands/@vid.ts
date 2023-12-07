import WAWebJS, { MessageMedia } from 'whatsapp-web.js'
import youtubedl from 'youtube-dl-exec'
import { IMessageRawData } from '../../types'
import { logger } from '../../utils/helpers'
import path from 'path'
import fs from 'fs'

export function videoExists(path: string) {
  try {
    fs.accessSync(path)
    return true
  } catch (error) {
    return false
  }
}

export function getVideoQuality(url: string, quality = '(mp4)[height<480]') {
  if (url.includes('https://x.com')) {
    url.replace('https://x.com', 'https://twitter.com')
  }

  return url.includes('instagram') || url.includes('twitter') || url.includes('x.com')
    ? '(mp4)'
    : quality
}

export async function downloadVideo(url: string) {
  const quality = getVideoQuality(url)
  const video = await youtubedl(url, {
    format: quality,
    output: path.resolve(__dirname, '../../../public/cdn/videos/%(id)s.%(ext)s'),
    noCheckCertificates: true,
    noWarnings: true,
    addHeader: ['referer:youtube.com', 'user-agent:googlebot']
  })

  return video
}

export async function getVideoInfo(url: string) {
  const quality = getVideoQuality(url)
  const video = await youtubedl(url, {
    format: quality,
    dumpJson: true,
    output: path.resolve(__dirname, '../../../public/cdn/videos/%(id)s.%(ext)s'),
    noCheckCertificates: true,
    noWarnings: true,
    skipDownload: true,
    addHeader: ['referer:youtube.com', 'user-agent:googlebot']
  })

  return video
}

export async function vid(client: WAWebJS.Client, message: WAWebJS.Message, cmd?: string) {
  let url = message.body.replace(`${cmd} `, '')
  const chat = await message.getChat()

  const quotedMessage = (await message.getQuotedMessage())?.rawData as IMessageRawData
  url = quotedMessage?.canonicalUrl ? quotedMessage.canonicalUrl : url

  try {
    await message.reply('📼 Realizando download...')

    const video = await getVideoInfo(url)

    if (!videoExists(video._filename)) {
      logger.info(`@vid => [download] ${video.url}`)
      await downloadVideo(url)
    }

    const media = MessageMedia.fromFilePath(video._filename)
    console.log('media', media)
    return chat.sendMessage(media, { caption: video.title })
  } catch (error) {
    logger.red('@vid ERRO =>', error)
  }

  return message.reply('😕 Erro baixar o vídeo.')
}
