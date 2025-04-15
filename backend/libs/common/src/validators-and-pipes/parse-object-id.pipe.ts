import { ConstructObjectId, isObjectId } from '@db/utils'
import { BadRequestException } from '@nestjs/common'

export class ParseIdPipe {
  transform(value: string) {
    if (!isObjectId(value)) {
      throw new BadRequestException('Invalid id')
    }

    return ConstructObjectId(value)
  }
}
