import { ID } from '@db/types'
import { Prop, Schema } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'

@Schema({ timestamps: true })
export abstract class AbstractDocument {
  // @ApiProperty({ type: Number })
  // @Prop({ type: Number, unique: true, index: true, required: true })
  // id: number

  @ApiProperty({
    type: String,
    example: '5f9b2c9b9c9d6b0017b2e2a0',
    readOnly: true,
  })
  _id: ID

  @Prop({ index: true })
  @ApiProperty({
    type: Date,
    example: '2023-09-24T07:11:54.259Z',
    readOnly: true,
  })
  createdAt: Date
  @Prop({ index: true })
  @ApiProperty({
    type: Date,
    example: '2023-09-24T07:11:54.259Z',
    readOnly: true,
  })
  updatedAt: Date

  @Prop({ index: true, type: Date, default: null, required: false })
  @ApiProperty({
    type: Date,
    example: '2023-09-24T07:11:54.259Z',
    readOnly: true,
  })
  deletedAt?: Date | null = null
}
