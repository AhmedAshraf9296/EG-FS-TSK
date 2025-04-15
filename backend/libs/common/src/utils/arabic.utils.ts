import { from_string } from './bidi.utils'

const isArabic = (text: string): boolean => {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/
  return arabicRegex.test(text)
}

const reverseText = (text: string): string => {
  return reorderVisually(text)
    .replaceAll('/', 'ForwardSlashSign')
    .replaceAll('(', 'leftBracketSign')
    .replaceAll(')', 'rightBracketSign')
    .replaceAll('leftBracketSign', ')')
    .replaceAll('rightBracketSign', '(')
    .replaceAll('ForwardSlashSign', '/')
    .split('')
    .reverse()
    .join('')
}

export const maybeRtlize = (text: string): string => {
  if (isArabic(text)) {
    return reverseText(text)
  }
  return text
}

export const reorderVisually = (
  text: string,
  direction: 'LTR' | 'RTL' = 'RTL',
): string => {
  const bidiText = from_string(text, { direction })
  bidiText.reorder_visually()
  return bidiText.toString()
}
