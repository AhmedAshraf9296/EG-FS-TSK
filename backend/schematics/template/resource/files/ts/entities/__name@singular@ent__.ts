<% if (type === 'graphql-code-first') { %>import { ObjectType, Field, Int } from '@nestjs/graphql';
@ObjectType()
export class <%= singular(classify(name)) %> {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}<% } else { %>import { defaultSchemaOptions } from '@db/config'
import { AbstractDocument } from '@db/model/abstract.model'
import { CrudPermissions } from '@lib/common/helpers'
import { Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema(defaultSchemaOptions)
export class <%= singular(classify(name)) %> extends AbstractDocument {}

export const <%= singular(classify(name)) %>Permissions = new CrudPermissions('<%= singular(lowercased(name)) %>')
const <%= singular(classify(name)) %>Schema = SchemaFactory.createForClass(<%= singular(classify(name)) %>)

export const <%= singular(classify(name)) %>Feature = {
  name: <%= singular(classify(name)) %>.name,
  schema: <%= singular(classify(name)) %>Schema,
}<% } %>
