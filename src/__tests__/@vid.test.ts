import { getVideoFile } from '../whatsapp/commands/@vid'
// import { MessageMedia } from 'whatsapp-web.js'

async function vid() {
  const url = 'https://www.youtube.com/watch?v=kuiZjitq2hU'

  try {
    const video = await getVideoFile(url)
    // const media = MessageMedia.fromFilePath(video._filename)

    console.log('video', video)
  } catch (error) {
    console.log('getVideoFile =>', error)
  }
}

vid()
