import { defaultSchemaOptions } from '@db/config'
import { AbstractDocument } from '@db/model/abstract.model'
import { CrudPermissions } from '@lib/common/helpers'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'

@Schema(defaultSchemaOptions)
export class User extends AbstractDocument {
  @Prop({ required: true })
  @ApiProperty({ example: 'Ahmed Ashraf' })
  name: string

  @Prop({ type: String, required: true, index: true })
  @ApiProperty({ example: 'ahmed.ashraf@gmail.com' })
  email: string

  @Prop({ type: String, required: true, unique: true, index: true })
  @ApiProperty({ example: '+201152875815' })
  phone: string

  @Prop({ type: String, required: true, select: false })
  password: string
}

export const UserPermissions = new CrudPermissions('user')
const UserSchema = SchemaFactory.createForClass(User)

export const UserFeature = {
  name: User.name,
  schema: UserSchema,
}
