import OpenAI from 'openai'
import { SpeechCreateParams } from 'openai/resources/audio/speech'
import { ImageGenerateParams } from 'openai/resources/images'
import { IChatHistory } from '../types'
import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources/index.mjs'

export const chatHistory: IChatHistory = {}

export const chatDefaultOptions: ChatCompletionCreateParamsNonStreaming = {
  model: process.env.OPENAI_MODEL,
  temperature: Number(process.env.OPENAI_TEMPERATURE),
  max_tokens: Number(process.env.OPENAI_MAX_TOKENS),
  messages: []
}

export const dalleOptions: Partial<ImageGenerateParams> = {
  n: 1,
  size: process.env.OPENAI_IMG_SIZE,
  model: process.env.OPENAI_IMG_MODEL
}

export const talkOptions: Omit<SpeechCreateParams, 'input'> = {
  model: process.env.OPENAI_TTS_MODEL,
  voice: process.env.OPENAI_VOICE,
  response_format: 'opus'
}

export const openAIClient = (() => {
  let instance: OpenAI

  function getInstance() {
    if (!instance) {
      instance = new OpenAI({
        organization: process.env.OPENAI_ORGANIZATION_ID,
        apiKey: process.env.OPENAI_OPENAI_KEY
      })
    }

    return instance
  }

  return {
    getInstance
  }
})()
