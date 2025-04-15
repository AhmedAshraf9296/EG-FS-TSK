import { ID } from '@db'
import { User } from '../entities/user.entity';
import { ConstructObjectId } from '@db/utils'
import { IsObjectId, AbstractFilterDto } from '@lib/common'
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

@ApiExtraModels(AbstractFilterDto)
export class FilterUserDto extends AbstractFilterDto {
  @IsObjectId()
  @IsOptional()
  @ApiProperty({ nullable: false, required: false, type: String })
  readonly _id?: ID

  toJSON(
    override?: Parameters<
      typeof AbstractFilterDto.prototype.toJSON<User>
    >[0],
  ) {
    return super.toJSON<User>({
      ...(this._id && { user: ConstructObjectId(this._id) }),
      ...override,
    })
  }
}


