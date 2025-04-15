import { FindParams } from '@db'
import { AbstractDocument } from '@db/model/abstract.model'
import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsOptional } from 'class-validator'

export class AbstractFilterDto {
  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  created_at_start?: Date
  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  created_at_end?: Date

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  updated_at_start?: Date
  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  updated_at_end?: Date

  toJSON<T extends AbstractDocument>(filter: FindParams<T>['filter'] = {}) {
    const query: typeof filter = {}

    if (this.created_at_start || this.created_at_end) {
      query.createdAt = {}
      if (this.created_at_start) {
        query.createdAt.$gte = new Date(this.created_at_start)
      }
      if (this.created_at_end) {
        query.createdAt.$lte = new Date(this.created_at_end)
      }
    }

    if (this.updated_at_start || this.updated_at_end) {
      query.updatedAt = {}
      if (this.updated_at_start) {
        query.updatedAt.$gte = new Date(this.updated_at_start)
      }
      if (this.updated_at_end) {
        query.updatedAt.$lte = new Date(this.updated_at_end)
      }
    }

    return {
      ...query,
      ...filter,
    }
  }
}
