import { HttpStatus } from '@nestjs/common'
import type { Readable, Stream } from 'stream'

export const isUndefined = (value: unknown): value is undefined =>
  typeof value === 'undefined'

export const isNull = (value: unknown): value is null => value === null

/**
 * Format Name
 *
 * Takes a string trims it and capitalizes every word
 */
export const formatName = (name: string): string =>
  name
    .trim()
    .replace(/\n/g, ' ')
    .replace(/\s\s+/g, ' ')
    .replace(/\w\S*/g, w => w.replace(/^\w/, l => l.toUpperCase()))

export const isValidUuid = (uuid: string): boolean =>
  // Checks if the uuid is a valid v4 uuid
  // https://stackoverflow.com/a/13653180
  uuid.match(
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  ) !== null

export function streamToPromise(stream: Stream): Promise<unknown> {
  return new Promise(function (resolve, reject) {
    stream.on('end', resolve)
    stream.on('finish', resolve)
    stream.on('close', resolve)
    stream.on('error', reject)

    // Prevent errors crashing Node.js, see:
    // https://github.com/nodejs/node/issues/20392
    // and https://github.com/nodejs/node/issues/20392#issuecomment-851061170
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  }).catch(() => {})
}

export function ignoreStream(stream: Readable) {
  // Prevent an unhandled error from crashing the process.
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  stream.on('error', () => {})

  // Waste the stream.
  stream.resume()
}

export function getStatusText(status: number): string {
  return HttpStatus[status] || 'Unknown Error'
}

/**
 * @description Transfers a string 'true' to a boolean
 * Used in query params stuff and other places where we need to convert a string to a boolean
 * @param value The value to be converted
 * @returns The converted value
 */
export function booleanify(value: unknown): boolean {
  return value === 'true'
}

/**
 * @description Checks if a value is not null or undefined
 * Used to handle falsy values like 0, false, '', etc they exist!!
 * @param value The value to be checked
 * @returns boolean
 */
export function isNotNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}
