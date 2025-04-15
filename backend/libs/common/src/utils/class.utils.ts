import { Class } from '../types'

export function fromPartial<T extends object>(
  newClass: Class<T>,
  obj: Partial<T>,
) {
  return Object.assign(new newClass(), obj)
}
