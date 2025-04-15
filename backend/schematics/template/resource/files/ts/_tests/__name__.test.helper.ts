import { <%= singular(classify(name)) %> } from './entities/<%= singular(name) %>.entity'

export function generateFake<%= singular(classify(name)) %> (data?: Partial<<%= singular(classify(name)) %>>) {
  return {
    ...data
  }
}
