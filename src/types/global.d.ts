///

/* -------------------------------------------------------------------------
| Env types
------------------------------------------------------------------------- */
namespace NodeJS {
  interface ProcessEnv {
    FASTIFY_PORT: string
    FASTIFY_DISABLE_REQ_LOG: string
    API_LOG_DEBUG: string
    API_HOST_URL: string
    API_HOST_URL_PROD: string
    API_CDN_URL: string
    MARVIN_TOKEN: string
    MARVIN_NUMBER: string
    MARVIN_NUMBER2: string
    MARVIN_ALLOW_TYPES: string
    MARVIN_WEBHOOK: string
    UUID_NAMESPACE: string
    OPENAI_ORGANIZATION_ID: string
    OPENAI_OPENAI_KEY: string
    OPENAI_MODEL:
      | 'gpt-4-1106-preview'
      | 'gpt-4-vision-preview'
      | 'gpt-4'
      | 'gpt-4-0314'
      | 'gpt-4-0613'
      | 'gpt-4-32k'
      | 'gpt-4-32k-0314'
      | 'gpt-4-32k-0613'
      | 'gpt-3.5-turbo'
      | 'gpt-3.5-turbo-16k'
      | 'gpt-3.5-turbo-0301'
      | 'gpt-3.5-turbo-0613'
      | 'gpt-3.5-turbo-16k-0613'
    OPENAI_MAX_TOKENS: string
    OPENAI_TEMPERATURE: string
    OPENAI_IMG_SIZE: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792' | null
    OPENAI_IMG_MODEL: string
    OPENAI_TTS_MODEL: 'tts-1' | 'tts-1-hd'
    OPENAI_VOICE: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
    BITLY_TOKEN: string
    BITLY_GUID: string
    RAPIDAPI_KEY: string
    IP_API_KEY: string
    IP_API_URL: string
    ES_HOST: string
    ES_USER: string
    ES_PASS: string
    ES_AUTHORIZATION: string
    ES_ANALYTICS_REDE_INDEX: string
    INTEGRATION_URL: string
    INTEGRATION_USER: string
    INTEGRATION_PASS: string
  }
}

/* -------------------------------------------------------------------------
| Types
------------------------------------------------------------------------- */
