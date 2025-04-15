export const LanguageHeader = 'x-langauge' as const

export const IndexName = 'chat' as const

export const EVENTS = {
  CHAT: 'chat',
  RESPONSE: 'response',
  RESPONSE_CONTINUE: 'response-listen-event',
  EXCEPTION: 'exception',
  REQUEST_DISEASE_DETECTION_IMAGE_B64: 'RequestDiseaseDetectionImageB64',
  REQUEST_VOICE_MESSAGE: 'chat-voicemessage',
  GET_VOICE_MESSAGE_TEXT: 'get-voice-text',
  DISEASE_DETECTION_RESPONSE: (id: string) => `DiseaseDetectionResponse-${id}`,
} as const

export const DiseaseSubscriptionName = 'langchain-service-stag' as const
export const DiseaseRequestTopic = 'disease-detection-request-stag' as const
export const DiseaseResultName = 'disease-detection-response-stag' as const

export const SERVER_EVENTS = {
  BUS_DISEASE_MESSAGE: 'bus.message.disease.received',
  GLOBAL_BROADCAST_TO_CHAT: 'global.broadcast.chat',
} as const
