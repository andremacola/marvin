import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'
import WAWebJS from 'whatsapp-web.js'

/* -------------------------------------------------------------------------
| Types
------------------------------------------------------------------------- */
interface IWhpCommand {
  [key: string]: (
    client: WAWebJS.Client,
    message: WAWebJS.Message,
    cmd?: string
  ) => Promise<WAWebJS.Message | undefined>
}

interface IMessageRawData extends WAWebJS.Message {
  canonicalUrl: string
  [key: string]: unknown
}

interface IChatHistory {
  [key: string]: ChatCompletionMessageParam[]
}
