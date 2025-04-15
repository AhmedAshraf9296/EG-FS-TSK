import { File } from 'fastify-multer/lib/interfaces'

export type ServerRecivedFile = File & {
  buffer: Buffer
}
