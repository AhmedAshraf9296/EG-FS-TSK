import { AbstractDocument } from '@db/model/abstract.model'
import { AbstractRepository } from '@db/repositories'
import { RequiredType } from '@lib/common'

// Removes null, optional and undefined from type
export type FindParams<T extends AbstractDocument> = RequiredType<
  Parameters<AbstractRepository<T>['findAllRaw']>[0]
> &
  NonNullable<unknown>

export type Select<T extends AbstractDocument> = FindParams<T>['select']

// Optional
export type FindOptionalParams<T extends AbstractDocument> = Partial<
  FindParams<T>
>

export type CreateParams<T extends AbstractDocument> = Omit<
  Partial<T>,
  'createdAt' | 'updatedAt'
>
