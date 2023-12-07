import { getVideoInfo, downloadVideo, videoExists } from '../whatsapp/commands/@vid'

async function vid() {
  const url = 'https://www.youtube.com/watch?v=kuiZjitq2hU'

  try {
    const video = await getVideoInfo(url)

    if (!videoExists(video._filename)) {
      console.log('Vídeo does not exist =>', video._filename)
      await downloadVideo(url)
    } else {
      console.log('Vídeo exist =>', video._filename)
    }

    console.log('Vídeo Info =>', video._filename)
  } catch (error) {
    console.log('getVideoFile =>', error)
  }
}

vid()
