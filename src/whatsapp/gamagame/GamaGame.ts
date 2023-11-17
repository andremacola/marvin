import WAWebJS from 'whatsapp-web.js'
import { QuestionInterface, AnswerInterface, generateQuestions } from './questions'
import { logger } from '../../utils/helpers'

interface PlayerScoreInterface {
  pushname?: string
  name: string
  score: number
}

interface WhatsAppInterface {
  client?: WAWebJS.Client
  message?: WAWebJS.Message
}

export class GamaGame {
  private whp: WhatsAppInterface
  private group: string
  private questions!: QuestionInterface[]
  private correctAnswers: string[] = []
  private currentQuestion = 0
  private answered = 0
  private gameLenght = 60000
  private players: PlayerScoreInterface[] = []
  private timer?: NodeJS.Timeout
  private whatsAppBindedHandler: (message: WAWebJS.Message) => void

  constructor(
    { client, message }: WhatsAppInterface,
    private questionsPerGame = 10,
    private topics?: string
  ) {
    this.whp = { client: client, message: message }
    this.group = message ? message.from : 'default'
    this.whatsAppBindedHandler = this.whatsappHandler.bind(this)
  }

  public async startGame() {
    this.whp.client?.sendMessage(this.group, '🏁 *Iniciando GamaGame...* 🏁')
    this.whp.client?.sendMessage(this.group, '⏳ *Gerando perguntas e respostas...*')
    this.questions = await generateQuestions(this.questionsPerGame, this.topics)

    logger.log(`#### [${this.group}]: Start GamaGame ####`)

    this.whatsappAddListeners()
    this.nextQuestion()
    this.timer = setInterval(() => this.nextQuestion(true), this.gameLenght)
  }

  public async endGame() {
    logger.log(`#### [${this.group}]: GamaGame Ended ####`)
    logger.gre(`[${this.group}]: End Score =>`, JSON.stringify(this.players))
    await this.whp.client?.sendMessage(this.group, '🏁 *GamaGame Encerrado!!* 🏁')
    await this.whp.client?.sendMessage(this.group, this.getToralScoreMessage())
    //@TODO: MOSTRAR O SCORE TOTAL DE SEMPRE (BANCO DE DADOS)

    /* reset all attributes */
    this.whatsappRemoveListeners()
    clearInterval(this.timer)
    this.timer = undefined
    this.questions = []
    this.currentQuestion = 0
    this.answered = 0
    this.players = []
  }

  public isRunning() {
    return Boolean(this.timer)
  }

  private showScore() {}

  /* -------------------------------------------------------------------------
  | Envia a resposta do player e setar score caso a resposta for correta
  ------------------------------------------------------------------------- */
  public submitAnswer(player: string, playerAnswer: string, pushname?: string) {
    const res = this.validateAnswer(playerAnswer)

    if (!res?.weight) {
      logger.red(`[${this.group} -> ${player}]: ${playerAnswer}`)
      return
    }

    this.setAnswered(playerAnswer)
    this.setPlayerScore(player, res.weight, pushname)
    const playerScore = this.getPlayerScore(player) || res.weight
    logger.yel(`[${this.group} -> ${player}]: ${playerAnswer} => ${res.weight} (${playerScore})`)
    this.whp.client?.sendMessage(
      this.group,
      `*✅ [${pushname} (${playerScore})]:* Resposta *${playerAnswer}* correta!`
    )

    /* verifique se todas as respostas foram respondidas e passa para próxima pergunta */
    if (!this.lastQuestion() && this.allAnswered()) {
      this.nextQuestion()
    }

    /* finaliza o jogo caso tudo tenha sido respondido e seja a última pergunta */
    if (this.lastQuestion() && this.allAnswered()) {
      this.endGame()
    }
  }

  /* -------------------------------------------------------------------------
  | Setar/Recuperar score dos players
  ------------------------------------------------------------------------- */
  private getPlayer(player: string) {
    return this.players.find(p => p.name === player)
  }

  private getPlayerScore(player: string) {
    return this.getPlayer(player)?.score
  }

  private setPlayerScore(playerName: string, weight: number, pushname?: string) {
    const player = this.getPlayer(playerName)

    if (!player) {
      return this.players.push({
        name: playerName,
        score: weight,
        pushname: pushname
      })
    }

    return (player.score += weight)
  }

  private getToralScoreMessage() {
    const players = this.players.sort((a, b) => a.score - b.score)
    let totalScoreMessage = '*🐎 Pontuação Final:* \n'

    if (players.length) {
      players.forEach((player, pos) => {
        totalScoreMessage += `*${pos + 1} - [${player.pushname}]:* Score: *${player.score}*\n`
      })
    } else {
      totalScoreMessage += '*Nenhum jogador participou do GamaGame!*'
    }

    return totalScoreMessage
  }

  /* -------------------------------------------------------------------------
  | Verifica/Seta quantas respostas faltam para perguta atual
  ------------------------------------------------------------------------- */
  private allAnswered() {
    const answers = this.questions[this.currentQuestion].answers
    return this.answered === answers.length
  }

  private setAnswered(playerAnswer: string) {
    this.correctAnswers.push(playerAnswer.toLocaleLowerCase().trim())
    this.answered++
  }

  /* -------------------------------------------------------------------------
  | Valida a resposta dada pelo jogador
  ------------------------------------------------------------------------- */
  private validateAnswer(playerAnswer: string): AnswerInterface {
    const playerAnswerLower = playerAnswer.toLocaleLowerCase().trim()
    return this.questions[this.currentQuestion].answers.find(a => {
      const answerLower = a.answer.toLocaleLowerCase().trim()
      return answerLower === playerAnswerLower && !this.correctAnswers.includes(playerAnswerLower)
    }) as AnswerInterface
  }

  /* -------------------------------------------------------------------------
  | Retorna a pergunta atual
  ------------------------------------------------------------------------- */
  private getCurrentTopic() {
    const question = this.questions[this.currentQuestion].topic
    return question
  }

  private getCurrentQuestion() {
    const question = this.questions[this.currentQuestion].question
    return question
  }

  private lastQuestion() {
    return this.currentQuestion === this.questions.length - 1
  }

  private hasQuestion() {
    return this.currentQuestion < this.questions.length - 1
  }

  private nextQuestion(skipQuestion = false) {
    if ((this.hasQuestion() && this.answered !== 0) || skipQuestion) {
      this.answered = 0
      this.currentQuestion++

      this.whp.client?.sendMessage(
        this.group,
        `🔚 *Pergunta finalizada, próxima pergunta em instantes...*`
      )
    }

    if (this.lastQuestion()) {
      clearInterval(this.timer)
      setTimeout(() => this.endGame(), this.gameLenght)
    }

    logger.info(
      `[${this.group}]: Question => *${this.getCurrentTopic()}*`,
      this.getCurrentQuestion()
    )

    this.whp.client?.sendMessage(
      this.group,
      `❔*${this.getCurrentTopic()}*: ${this.getCurrentQuestion()}❔`
    )
  }

  /* -------------------------------------------------------------------------
  | Whatsapp methods and listeners
  ------------------------------------------------------------------------- */
  private whatsappAddListeners() {
    this.whp.client?.on('message', this.whatsAppBindedHandler)
  }

  private whatsappRemoveListeners() {
    this.whp.client?.off('message', this.whatsAppBindedHandler)
  }

  private async whatsappHandler(msg: WAWebJS.Message) {
    if (msg.from !== this.group || msg.body.includes('@')) {
      return
    }

    this.submitAnswer(msg.author!, msg.body, (await msg.getContact()).pushname)
  }
}
