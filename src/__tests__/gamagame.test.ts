import { GamaGame } from '../whatsapp/gamagame/GamaGame'

const playersAnswers = [
  { player: 'hissami', answer: '1-Brasil-5' },
  { player: 'helio', answer: '1-Brasil-5' },
  { player: 'pedro', answer: '1-Alemanha-3' },
  { player: 'tomas', answer: '1-Uruguai-1' },
  { player: 'helio', answer: '1-Brasil-5' },
  { player: 'andre', answer: '1-Espanha-1' },
  { player: 'eduardo', answer: '1-Brasil-5' },
  { player: 'hissami', answer: '2-Brasil-5' },
  { player: 'pedro', answer: '2-Alemanha-3' },
  { player: 'helio', answer: '2-Brasil-5' },
  { player: 'tomas', answer: '2-Uruguai-1' },
  { player: 'andre', answer: '2-Espanha-1' },
  { player: 'eduardo', answer: '3-Brasil-5' },
  { player: 'helio', answer: '3-Brasil-5' }
]

const game = new GamaGame({}, 2)

// @ts-ignore (bun)
await game.startGame()

function processArrayElements(answers: typeof playersAnswers) {
  let index = 0

  const intervalId = setInterval(() => {
    if (index >= answers.length || !game.isRunning()) {
      clearInterval(intervalId)
      return
    }

    const res = answers[index]
    game.submitAnswer(res.player, res.answer)
    index++
  }, 2000)
}

processArrayElements(playersAnswers)
