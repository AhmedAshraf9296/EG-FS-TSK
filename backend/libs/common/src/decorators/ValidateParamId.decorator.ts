import { Param } from '@nestjs/common'
import { ParseIdPipe } from '../validators-and-pipes/parse-object-id.pipe'

export const IdParam = (name: string) => Param(name, new ParseIdPipe())
