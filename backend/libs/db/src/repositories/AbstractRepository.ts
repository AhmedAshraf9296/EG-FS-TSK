import type { AbstractDocument } from '@db/model/abstract.model'
import type { CreateParams, FindParams, ID } from '@db/types'
import { ConstructObjectId, ConstructObjectIds } from '@db/utils'
import type { WrapperType } from '@lib/common'
import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import {
  FilterQuery,
  Model,
  PopulateOptions,
  ProjectionType,
  Types,
  UpdateQuery,
} from 'mongoose'

export abstract class AbstractRepository<
  TDocument extends WrapperType<AbstractDocument>,
> {
  protected abstract readonly logger: Logger

  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: CreateParams<TDocument>): Promise<TDocument>
  async create(document: CreateParams<TDocument>[]): Promise<TDocument[]>

  async create(
    document: CreateParams<TDocument> | CreateParams<TDocument>[],
  ): Promise<TDocument | TDocument[]> {
    // const lastId = await this.getLastId()
    // If used as an array Abandon all hope and just let nature take its course
    if (Array.isArray(document)) {
      // document.forEach(async (doc, index) => {
      //   if (!doc.id) {
      //     doc.id = lastId + index + 1
      //   }
      // })
      return this.model.create(document)
    }

    this.logger.debug(`Creating ${this.model.modelName}`)

    const createdDocument = (await this.model.create({ ...document })).toJSON()
    // this means it failed to create it. Usually due to missing @Schema decorator
    // By default mongoose will return an object with 2 keys if no props passed: _id and __v
    if (Object.keys(createdDocument).length === 2) {
      this.logger.error('Failed to create document!', createdDocument)
      await this.model.deleteOne({ _id: createdDocument._id })
      throw new InternalServerErrorException(
        'Failed to create document! ' + this.model.modelName,
      )
    }
    return createdDocument as TDocument
  }

  async findOneAndUpdateOrCreate(
    filterQuery: FilterQuery<TDocument>,
    updateData: Partial<TDocument>,
  ): Promise<TDocument> {
    const options = {
      upsert: true,
      new: true,
      lean: true,
      sanitizeFilter: true,
    }

    const updatedDocument = await this.model
      .findOneAndUpdate<TDocument>(
        { ...filterQuery, deletedAt: null },
        { $set: updateData },
        options,
      )
      .exec()

    return updatedDocument as unknown as TDocument
  }

  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model
      .findOne<TDocument>(
        {
          ...filterQuery,
          deletedAt: null,
        },
        { __v: 0 },
        { lean: true, sanitizeFilter: true },
      )
      .exec()

    if (!document) {
      this.logger.warn('Document not found with filterQuery', filterQuery)
      throw new NotFoundException(`${this.model.modelName} Document not found.`)
    }

    return document as unknown as TDocument
  }

  async findById(
    id: string | Types.ObjectId,
    select: FindParams<TDocument>['select'] = { __v: 0 },
  ): Promise<TDocument> {
    const document = await this.model
      .findById<TDocument>(id, select, { lean: true, sanitizeFilter: true })
      .exec()

    if (!document) {
      this.logger.warn(`Document not found with id: ${id}`)
      throw new NotFoundException(`${this.model.modelName} Document not found.`)
    }

    return document as unknown as TDocument
  }

  async updateById(
    id: string | Types.ObjectId,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model.findOneAndUpdate<TDocument>(
      {
        _id: id instanceof Types.ObjectId ? id : ConstructObjectId(id),
        deletedAt: null,
      },
      update,
      {
        lean: true,
        new: true,
      },
    )

    if (!document) {
      this.logger.warn(`Document not found with id: ${id}`)
      throw new NotFoundException(`${this.model.modelName} Document not found.`)
    }
    this.logger.debug(`Updated ${this.model.modelName} with id: ${id}`)

    return document as unknown as TDocument
  }

  async deleteById(id: string | ID): Promise<TDocument> {
    const document = await this.model.findByIdAndDelete<TDocument>(id)

    if (!document) {
      this.logger.warn(`Document not found with id: ${id}`)
      throw new NotFoundException(`${this.model.modelName} Document not found.`)
    }

    return document as unknown as TDocument
  }

  async softDeleteById(id: string | ID): Promise<TDocument> {
    const document = await this.model.findOneAndUpdate<TDocument>(
      {
        _id: id instanceof Types.ObjectId ? id : ConstructObjectId(id),
        deletedAt: null,
      },
      {
        deletedAt: new Date(),
      },
    )

    if (!document) {
      this.logger.warn(`Document not found with id: ${id}`)
      throw new NotFoundException(`${this.model.modelName} Document not found.`)
    }

    return document as unknown as TDocument
  }

  async softDelete(filterQuery: FilterQuery<TDocument>) {
    const document = await this.model.findOneAndUpdate<TDocument>(
      {
        ...filterQuery,
        deletedAt: null,
      },
      {
        deletedAt: new Date(),
      },
    )

    if (!document) {
      this.logger.warn(`Document not found with filterQuery:`, filterQuery)
      throw new NotFoundException(`${this.model.modelName} Document not found.`)
    }

    return document as unknown as TDocument
  }

  /**
   * @description Finds a single document and updates it.
   * @throws {NotFoundException} if document is not found.
   */
  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
    options: { lean?: boolean; new?: boolean; upsert?: boolean } = {
      new: true,
    },
  ) {
    const document = await this.model
      .findOneAndUpdate<TDocument>(
        { ...filterQuery, deletedAt: null },
        update,
        options,
      )
      .lean()
      .exec()

    if (!document) {
      this.logger.warn(`Document not found with filterQuery:`, filterQuery)
      throw new NotFoundException(`${this.model.modelName} Document not found.`)
    }

    return document as unknown as TDocument
  }

  async findOneAndDelete(filterQuery: FilterQuery<TDocument>) {
    const document = await this.model
      .findOneAndDelete<TDocument>({
        ...filterQuery,
        deletedAt: null,
      })
      .lean()

    if (!document) {
      this.logger.warn(`Document not found with filterQuery:`, filterQuery)
      throw new NotFoundException(`${this.model.modelName} Document not found.`)
    }

    return document as unknown as TDocument
  }

  // In case we want to populate the document or do something else with the query.
  protected findAllRaw<T = TDocument>(options?: {
    filter?: FilterQuery<TDocument>
    select?: ProjectionType<TDocument>
    skip?: number
    take?: number
    sort?: string
    sortDirection?: -1 | 1
    populate?: PopulateOptions
  }) {
    const filter = { ...options?.filter, deletedAt: null }
    // Select can only be inclusive or exclusive, not both. Allow overrides.
    const select = options?.select || { deletedAt: 0, __v: 0 }

    let query = this.model.find<T>(filter, select, {
      // sanitizeFilter: true,
    })

    if (options?.populate) {
      query = query.populate(options.populate)
    }

    if (options?.take && options?.take > 0) {
      query = query.skip(options?.skip ?? 0).limit(options.take)
    }

    return query
      .sort({ [options?.sort ?? 'createdAt']: options?.sortDirection ?? -1 })
      .lean()
  }

  async findAndCount(
    options?: Parameters<typeof AbstractRepository.prototype.findAllRaw>[0],
  ) {
    const filter = { ...(options?.filter ?? {}), deletedAt: null }
    const [items, total] = await Promise.all([
      this.findAllRaw<TDocument>(options).exec(),
      this.model.countDocuments(filter).lean().exec(),
    ])
    return {
      items,
      total,
    }
  }

  async find(
    options?: Parameters<typeof AbstractRepository.prototype.findAllRaw>[0],
  ) {
    const query = this.findAllRaw<TDocument>(options)
    return query.exec() as Promise<TDocument[]>
  }

  async count(filterQuery?: FilterQuery<TDocument>) {
    const filter = { ...(filterQuery ?? {}), deletedAt: null }
    return this.model.countDocuments(filter).lean().exec()
  }

  async hardDeleteById(id: ID) {
    const document = await this.model.findByIdAndDelete(id)
    if (!document) {
      this.logger.warn(`Document not found with id: ${id}`)
      throw new NotFoundException(`${this.model.modelName} Document not found.`)
    }
    return document as unknown as TDocument
  }

  async exists(filterQuery: FilterQuery<TDocument>): Promise<boolean> {
    try {
      const filter = { ...filterQuery, deletedAt: null }
      return !!(await this.model.exists(filter))
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async deleteMany(filterQuery: FilterQuery<TDocument>) {
    const filter = { ...filterQuery, deletedAt: null }
    // Get all items first then delete them. Required for safe keeping
    const items = await this.findAllRaw({ filter }).exec()
    await this.model
      .deleteMany({
        _id: {
          $in: items.map(item => item._id),
        },
      })
      .exec()
    return items
  }

  getModelName() {
    return this.model.modelName
  }
  getCollectionName() {
    return this.model.collection.name
  }

  distinct(item: string, filter?: FilterQuery<TDocument>) {
    return this.model.distinct(item, filter)
  }

  findAndCountRaw(
    options?: Parameters<typeof AbstractRepository.prototype.findAllRaw>[0],
  ) {
    const filter = { ...(options?.filter ?? {}), deletedAt: null }
    return Promise.all([
      this.findAllRaw<TDocument>(options).exec(),
      this.model.countDocuments(filter).lean().exec(),
    ])
  }

  async aggregate<T = TDocument>(pipeline: any[]) {
    return this.model.aggregate<T>(pipeline).exec()
  }

  async aggregateAndCount<T = TDocument>(pipeline: any[]) {
    const [items, total] = await Promise.all([
      this.model.aggregate<T>(pipeline).exec(),
      this.model.aggregate(pipeline).count('count').exec(),
    ])
    return {
      total: total[0]?.count ?? 0,
      items: items as T[],
    }
  }

  // async getLastId() {
  //   const lastDocument = await this.model
  //     .findOne({}, { id: 1 }, { lean: true })
  //     .sort({ id: -1 })
  //     .exec()
  //   return lastDocument?.id ?? 1
  // }

  async deleteManyByIds(ids: Array<string>) {
    const returned = await this.model
      .deleteMany({
        _id: {
          $in: ConstructObjectIds(ids),
        },
      })
      .exec()

    if (returned.deletedCount !== ids.length) {
      this.logger.warn(
        `Bulk Deleted ${returned.deletedCount} documents instead of ${ids.length}`,
      )
    }
    return returned.deletedCount
  }
}
