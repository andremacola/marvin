import { IWhpCommand } from '../types'
import { help } from './commands/@help'
import { pay } from './commands/@pay'
import { ping } from './commands/@ping'
import { vid } from './commands/@vid'
import { usd, eur } from './commands/@coin'
import { ac } from './commands/@ac'
import { marvinChat, marvinTalk, marvinReset } from './commands/@marvin'
import { dalle } from './commands/@dalle'
import { vision } from './commands/@vision'
import { resume } from './commands/@resume'
import { game } from './commands/@game'

const commands: IWhpCommand = {
  help: help,
  ping: ping,
  vid: vid,
  pay: pay,
  resume: resume,
  ac: ac,
  usd: usd,
  eur: eur,
  img: dalle,
  dalle: dalle,
  vision: vision,
  talk: marvinTalk,
  marvin: marvinChat,
  reset: marvinReset,
  game: game
}

commands[process.env.MARVIN_NUMBER] = marvinChat

export { commands }
