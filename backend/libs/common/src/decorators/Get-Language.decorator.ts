import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Socket } from 'socket.io'
import { LanguageHeader } from '../config/keys'
import { ServerRequest } from '../types'
import { LanguageType } from '../types/language.type'

/**
 *  @description Get the language from the request headers
 *  @param {LangaugeType} [data='en'] - The default language, must be of type `en` or `ar`
 *  @returns {string} - The language
 */
export const Language = createParamDecorator(
  (defaultLang: LanguageType = 'ar', ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<ServerRequest>()
    const lang = request.headers[LanguageHeader] || defaultLang
    if (lang === 'all') return undefined
    return lang
  },
)
/**
 *  @description Get the language from the request headers
 *  @param {LangaugeType} [data='en'] - The default language, must be of type `en` or `ar`
 *  @returns {string} - The language
 */
export const LanguageWithoutAll = createParamDecorator(
  (defaultLang: LanguageType = 'ar', ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<ServerRequest>()
    const lang = request.headers[LanguageHeader] || defaultLang
    return lang
  },
)

export const WsLanguage = createParamDecorator(
  (defaultLang: LanguageType = 'ar', ctx: ExecutionContext) => {
    const client = ctx.switchToWs().getClient<Socket>()
    const lang = client.handshake.headers[LanguageHeader] || defaultLang
    if (lang === 'all') return undefined
    return lang
  },
)

export const getLanguageWithCountryCode = (lang: string) => {
  switch (lang) {
    case 'en':
      return 'en-US'
    case 'ar':
      return 'ar-EG'
    default:
      return 'ar-EG'
  }
}

export const LanguageWithCountryCode = createParamDecorator(
  (defaultLang: LanguageType = 'ar', ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<ServerRequest>()
    const lang = request.headers[LanguageHeader]?.toString() || defaultLang
    if (lang === 'all') return undefined
    return getLanguageWithCountryCode(lang)
  },
)
