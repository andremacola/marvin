import { getVideoFileUrl } from '../whatsapp/commands/@vid'

async function vid() {
  const url = 'https://www.youtube.com/watch?v=kuiZjitq2hU'

  try {
    const videoUrl = await getVideoFileUrl(url)
    console.log('video', videoUrl)
  } catch (error) {
    console.log('getVideoFile =>', error)
  }
}

vid()
