import type { CookieOptions } from 'express'

export const maxAge = 1000 * 60 * 60 * 24 * 365 // 1 year

export const cookieOptions = (scheme: string): CookieOptions => ({
  httpOnly: true,
  secure: scheme === 'https',
  signed: true,
  maxAge,
})
