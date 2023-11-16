import WAWebJS from 'whatsapp-web.js'
import { GamaGame } from '../gamagame/GamaGame'

interface GamesInterface {
  group: string
  game: GamaGame | null
  started: boolean
}

const games: GamesInterface[] = []
const admin = process.env.WA_ADMIN_NUMBER

export async function game(client: WAWebJS.Client, message: WAWebJS.Message, cmd?: string) {
  if (message.author !== admin) {
    return message.reply('A função *@gamagame* somente pode iniciada pelo administrador.')
  }

  if (message.body.startsWith('@game start')) {
    const chat = await message.getChat()

    if (!chat.isGroup) {
      return client.sendMessage(message.from, 'Este comando só pode ser usado em grupos.')
    }

    let topics: string | undefined = message.body.replace('@game start', '').trim()
    topics = topics.length > 5 ? topics : undefined

    const game = new GamaGame({ client: client, message: message }, 10, topics)
    games.push({ group: message.from, game: game, started: true })

    // @ts-ignore
    return (await game.startGame()) as WAWebJS.Message
  }

  if (message.body === '@game end') {
    const game = games.find(game => game.group === message.from)
    const gameIndex = games.findIndex(game => game.group === message.from)

    if (game && game.game) {
      await game.game.endGame()
      games.splice(gameIndex, 1)
      return
    }
  }

  return client.sendMessage(message.from, 'Desculpe, comando inexistente.')
}
