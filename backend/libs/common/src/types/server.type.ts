import type { FastifyReply, FastifyRequest } from 'fastify'
import { TokenPayloadDto } from './token.type'

export type ServerRequest = FastifyRequest
export type ServerRequestWithUser = FastifyRequest & { user: TokenPayloadDto }
export type ServerResponse = FastifyReply
