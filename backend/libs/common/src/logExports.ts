import * as index from './index'

export function logExports() {
  for (const key in index) {
    console.log(key)
  }
}
