import { chatHistory, chatDefaultOptions, openAIClient } from '../../clients/openai'
import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources/index.mjs'
import { logger } from '../../utils/helpers'

/* -------------------------------------------------------------------------
| Types
------------------------------------------------------------------------- */

export type AnswerWeightInterface = 1 | 3 | 5

export interface AnswerInterface {
  answer: string
  weight: AnswerWeightInterface
}

export interface QuestionInterface {
  topic?: string
  question: string
  answers: AnswerInterface[]
}

export const gameQuestionsTest: QuestionInterface[] = [
  {
    topic: 'Teste',
    question: 'Quem ganhou a Copa do Mundo?',
    answers: [
      { answer: '1-Brasil-5', weight: 5 },
      { answer: '1-Alemanha-3', weight: 3 },
      { answer: '1-Uruguai-1', weight: 1 },
      { answer: '1-Espanha-1', weight: 1 }
    ]
  },
  {
    topic: 'Teste',
    question: 'Quais são os times da Séria A?',
    answers: [
      { answer: '2-Brasil-5', weight: 5 },
      { answer: '2-Alemanha-3', weight: 3 },
      { answer: '2-Uruguai-1', weight: 1 },
      { answer: '2-Espanha-1', weight: 1 }
    ]
  },
  {
    topic: 'Teste',
    question: 'Quais são os times da Séria B?',
    answers: [
      { answer: '3-Brasil-5', weight: 5 },
      { answer: '3-Alemanha-3', weight: 3 },
      { answer: '3-Uruguai-1', weight: 1 },
      { answer: '3-Espanha-1', weight: 1 }
    ]
  }
]

/* -------------------------------------------------------------------------
| Variables and Functions
------------------------------------------------------------------------- */
const openai = openAIClient.getInstance()

function parseMarkdownJson(markdownJson: string) {
  const jsonString = markdownJson.replace(/```json\n|\n```/g, '')
  const jsonData = JSON.parse(jsonString)

  return jsonData
}

export async function generateQuestions(
  qnt = 10,
  topics = 'esporte, entretenimento, curiosidades, política, filmes, séries de TV, quadrinhos, geografia, história, música, arte e conhecimentos gerais',
  useAI = true
): Promise<QuestionInterface[]> {
  if (!useAI) {
    return gameQuestionsTest
  }

  logger.info('Generating questions...', topics)
  let marvinResponse = ''
  const template =
    `Crie ${qnt} perguntas ou listas de um quiz abrangendo os tópicos: ${topics}. Siga as regras abaixo:
- Não forneça perguntas/listas de resposta única. Ex: Quem é o rei do pop?
- A pergunta não pode dar a entender que é múltipla escolha. Ex: Quais destes são esportes olímpicos?
- Faça perguntas/listas para múltiplas escolhas corretas. Ex: Nome de atores famosos.
- Não comece as perguntas/listas com: Quais (destes/destas/desses/dessas/das/dos).
- Cada pergunta deve ter no mínimo 5 respostas corretas.
- Utilize dados reais, não fictícios.
- Crie perguntas/listas com temas populares.
- Distribua os pesos 5, 3 e 1 para cada resposta, variando as pontuações.
- Apenas uma resposta por pergunta deve ter peso 5.
- Evite repetir perguntas/listas.
- Não coloque as respostas no pural.
- Retorne apenas o JSON no seguinte formato:

\`\`\`json
export interface AnswerInterface { answer: string, weight: number }
interface QuestionInterface { topic: string, question: string, answers: AnswerInterface[] }`.trim()

  const chatOptions: Partial<ChatCompletionCreateParamsNonStreaming> = {
    user: 'Marvin GamaGame',
    temperature: 0.5,
    max_tokens: 4000,
    messages: [{ role: 'user', content: template }]
  }

  const response = await openai.chat.completions.create({ ...chatDefaultOptions, ...chatOptions })
  response.choices.forEach(({ message }) => {
    marvinResponse += message.content
  })

  console.log('gameQuestions', marvinResponse)
  const gameQuestions = parseMarkdownJson(marvinResponse)
  return gameQuestions
}
