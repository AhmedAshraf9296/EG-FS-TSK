import { applyDecorators, HttpStatus, Type } from '@nestjs/common'
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiHeader,
  ApiMethodNotAllowedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger'
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'
import { LanguageHeader } from '../config/keys'
import { PaginatedDto } from '../dtos'
import { LanguageEnum, LanguageEnumWithouthAll } from '../types'

const defaultDecorators = [
  ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error, something wrong happened',
  }),
  ApiUnauthorizedResponse({
    description: 'Unauthorized, Missing or expired Token',
  }),
  ApiForbiddenResponse({ description: 'Forbidden. Missing Permission' }),
  ApiMethodNotAllowedResponse({
    description: 'Cannot Do this action on this resource.',
  }),
]

/**
 * @description Decorator to document the endpoint with Swagger
 * Takes an object with the following properties:
 * @param {string} options.summary - The summary of the endpoint
 * @param {string} options.okDescription - The description of the 200 response
 * @param {string} options.badRequestDescription - The description of the 400 response
 * @param {number} options.badStatus - The status code of a bad request, defaults to 400 response
 * @param {number} options.status - The status code of the success response
 * @param {boolean} options.deprecated - Whether the endpoint is deprecated or not
 * @param {boolean} options.paginated - Whether the endpoint is paginated or not (Uses {@link PaginatedDto})
 * @param {Type | [Type] | string | Function | [Function]} options.type - The type of the response
 *
 * @returns {MethodDecorator} MethodDecorator - The decorators applied to the method
 *
 * @example
 * @SwaggerDocumentation({
 *  summary: 'Get all items',
 *  okDescription: 'Items found',
 *  badRequestDescription: 'Bad Request Example',
 *  type: [Item],
 *  })
 *  findAllController() { ... }
 */
export function SwaggerDocumentation({
  summary,
  description,
  okDescription,
  badRequestDescription,
  badStatus = HttpStatus.BAD_REQUEST,
  status = HttpStatus.OK,
  deprecated = false,
  paginated = false,
  apiConsumes = 'application/json',
  okType,
  okSchema = null,
  okProperties = {},
}:
  | {
      summary: string
      description?: string
      okDescription?: string
      badRequestDescription?: string
      badStatus?: number
      status?: number
      deprecated?: boolean
      apiConsumes?: 'application/json' | 'multipart/form-data'
      paginated?: false
      // eslint-disable-next-line @typescript-eslint/ban-types
      okType?: Type | [Type] | string | Function | [Function]
      okSchema?: SchemaObject
      okProperties?: Parameters<typeof ApiOkResponse>[0]
    }
  | {
      summary: string
      description?: string
      apiConsumes?: 'application/json' | 'multipart/form-data'
      okDescription?: string
      badStatus?: number
      badRequestDescription?: string
      deprecated?: boolean
      status?: number
      paginated: true
      // eslint-disable-next-line @typescript-eslint/ban-types
      okType: Type | Function | string
      okSchema?: null
      okProperties?: Parameters<typeof ApiOkResponse>[0]
    }): MethodDecorator {
  if (status === HttpStatus.CREATED)
    return applyDecorators(
      ApiConsumes(apiConsumes),
      ApiOperation({ summary, description, deprecated }),
      ApiCreatedResponse({
        status,
        description: okDescription,
        schema: okSchema as any,
        type: okType,
        ...okProperties,
      }),
      ApiResponse({
        status: badStatus,
        description: badRequestDescription,
      }),
      ...defaultDecorators,
    )
  if (paginated)
    return applyDecorators(
      ApiOperation({ summary, description, deprecated }),
      ApiConsumes(apiConsumes),
      ApiExtraModels(PaginatedDto),
      ApiOkResponse({
        status,
        description: okDescription,
        ...okProperties,
        schema: {
          title: `PaginatedResponseOf${okType}`,
          allOf: [
            { $ref: getSchemaPath(PaginatedDto) },
            {
              properties: {
                items: {
                  type: 'array',
                  items: { $ref: getSchemaPath(okType as string) },
                },
              },
            },
          ],
        },
      }),
      ApiResponse({
        status: badStatus,
        description: badRequestDescription,
      }),
      ...defaultDecorators,
    )
  if (!okDescription)
    return applyDecorators(
      ApiConsumes(apiConsumes),
      ApiOperation({ summary, description, deprecated }),
      ...defaultDecorators,
    )
  return applyDecorators(
    ApiConsumes(apiConsumes),
    ApiOperation({ summary, description, deprecated }),
    ApiOkResponse({
      status,
      description: okDescription,
      schema: okSchema as any,
      type: okType,
      ...okProperties,
    }),
    ApiResponse({
      status: badStatus,
      description: badRequestDescription,
    }),
    ...defaultDecorators,
  )
}

/**
 * @description Decorator to document the pagination query params with Swagger
 * @returns {MethodDecorator} MethodDecorator - The decorators applied to the method
 * @example
 * @SwaggerDocumentationPaginationQuery()
 * findAll(@Paginate() paginate: Pagination) { ... }
 */
export function SwaggerDocumentationPaginationQuery(): MethodDecorator {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      example: 10,
      description: 'How many items to recieve',
    }),
    ApiQuery({
      name: 'sortKey',
      required: false,
      example: 'createdAt',
      description: 'Which property/key to sort by',
    }),
    ApiQuery({
      name: 'sortAsc',
      required: false,
      enum: ['true', 'false'],
      example: 'false',
      description: 'Sort ascending or descending',
    }),
  )
}

export function LanguageDocument(): MethodDecorator {
  return ApiHeader({
    name: LanguageHeader,
    required: false,
    description: 'Language, used for localization',
    schema: {
      type: 'string',
      enum: Object.values(LanguageEnum),
      default: LanguageEnum.Arabic,
      examples: {
        ...Object.values(LanguageEnum).reduce(
          (acc, lang) => ({
            ...acc,
            [lang]: {
              summary: lang,
              value: lang,
            },
          }),
          {},
        ),
      },
    },
  })
}

export function LanguageDocumentWithoutAll(): MethodDecorator {
  return ApiHeader({
    name: LanguageHeader,
    required: false,
    description: 'Language, used for localization',
    schema: {
      type: 'string',
      enum: Object.values(LanguageEnumWithouthAll),
      default: LanguageEnumWithouthAll.Arabic,
      examples: {
        en: {
          summary: LanguageEnumWithouthAll.English,
          value: LanguageEnumWithouthAll.English,
        },
        ar: {
          summary: LanguageEnumWithouthAll.Arabic,
          value: LanguageEnumWithouthAll.Arabic,
        },
      },
    },
  })
}

export const ApiFile = (fileName = 'file'): MethodDecorator =>
  applyDecorators(
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [`${fileName}`]: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
  )
