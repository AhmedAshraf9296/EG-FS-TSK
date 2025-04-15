// Lookup table for file extension
export const extensionLookup: Record<string, string> = {
  default: '',
  pdf: 'pdf',
  msword: 'doc',
  jpg: 'jpg',
  jpeg: 'jpeg',
  png: 'png',
  gif: 'gif',
  bmp: 'bmp',
  tiff: 'tiff',
  webp: 'webp',
  svg: 'svg',
  ico: 'ico',
  docx: 'docx',
  xlsx: 'xlsx',
  odt: 'odt',
  ods: 'ods',
  odp: 'odp',
  pptx: 'pptx',
  ppsx: 'ppsx',
  potx: 'potx',
  ppt: 'ppt',
  mpeg: 'mp3',
  mp4: 'mp4',
  wav: 'wav',
  'x-wav': 'wav',
  'svg+xml': 'svg',
  'vnd.microsoft.icon': 'ico',
  'vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'vnd.oasis.opendocument.text': 'odt',
  'vnd.oasis.opendocument.spreadsheet': 'ods',
  'vnd.oasis.opendocument.presentation': 'odp',
  'vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'vnd.openxmlformats-officedocument.presentationml.slideshow': 'ppsx',
  'vnd.openxmlformats-officedocument.presentationml.template': 'potx',
  'vnd.ms-powerpoint': 'ppt',
  'vnd.ms-powerpoint.presentation.macroEnabled.12': 'pptm',
  'vnd.ms-powerpoint.slideshow.macroEnabled.12': 'ppsm',
  'vnd.ms-powerpoint.template.macroEnabled.12': 'potm',
  'vnd.ms-excel': 'xls',
  'vnd.ms-excel.sheet.macroEnabled.12': 'xlsm',
  'vnd.ms-excel.template.macroEnabled.12': 'xltm',
  'vnd.ms-excel.addin.macroEnabled.12': 'xlam',
  'vnd.ms-excel.sheet.binary.macroEnabled.12': 'xlsb',
  'vnd.ms-powerpoint.addin.macroEnabled.12': 'ppam',
  'vnd.ms-word.document.macroEnabled.12': 'docm',
  'vnd.ms-word.template.macroEnabled.12': 'dotm',
} as const

export const imageMimeTypes = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/bmp',
  'image/webp',
  'image/vnd.microsoft.icon',
  'image/tiff',
  'image/svg+xml',
] as const

export const audioMimeTypes = [
  'audio/mpeg',
  'audio/wav',
  'audio/x-wav',
  'audio/vnd.wav',
] as const

export function getFileMimeTypeRegex(): {
  // eslint-disable-next-line no-unused-vars
  [Symbol.match](string: string): RegExpMatchArray | null
} {
  return /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/
}

export function getMimeType(base64file: string) {
  return base64file.split(';')[0].split(':')[1]
}

/**
 * @description Get file extension from mimetype
 * @param {string} mimetype File mimetype
 * @return {string} File extension with dot
 * @return {null} If no extension found
 * @example getExtension("image/png") // .png
 */
export function getExtension(
  mimetype: string,
): `.${(typeof extensionLookup)[string]}` | null {
  const format = mimetype.split('/')[1]
  const extension = extensionLookup[format] || extensionLookup.default

  if (!extension) return null

  return `.${extension}`
}

export function transformB64ImageUriToBuffer(data: string) {
  return Buffer.from(data.replace(/^data:image\/\w+;base64,/, ''), 'base64')
}

export function transformB64AudioUriToBuffer(data: string) {
  return Buffer.from(data.replace(/^data:audio\/\w+;base64,/, ''), 'base64')
}

// This checks if its a valid base64 uri data overall, not just images
export function checkIfB64Uri(data: string) {
  const match = data.match(getFileMimeTypeRegex())

  if (!match) return false
  // check if the mime type exists
  if (!match[1]) return false
  // replace base64 data with empty string
  const base64Data = data.replace(/^data:image\/\w+;base64,/, '')
  // check if the base64 data is valid
  if (!base64Data) return false

  return match
}
