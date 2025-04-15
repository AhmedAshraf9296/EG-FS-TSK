import { ID } from '@db'
import { <%= singular(classify(name)) %> } from '../entities/<%= singular(name) %>.entity';
import { ConstructObjectId } from '@db/utils'
import { IsObjectId, AbstractFilterDto } from '@lib/common'
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

@ApiExtraModels(AbstractFilterDto)
export class Filter<%= singular(classify(name)) %>Dto extends AbstractFilterDto {
  @IsObjectId()
  @IsOptional()
  @ApiProperty({ nullable: false, required: false, type: String })
  readonly _id?: ID

  toJSON(
    override?: Parameters<
      typeof AbstractFilterDto.prototype.toJSON<<%= singular(classify(name)) %>>
    >[0],
  ) {
    return super.toJSON<<%= singular(classify(name)) %>>({
      ...(this._id && { user: ConstructObjectId(this._id) }),
      ...override,
    })
  }
}

<%
// vim: set ft=template
%>
