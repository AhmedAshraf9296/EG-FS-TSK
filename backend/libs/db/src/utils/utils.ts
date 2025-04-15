import mongoose, { isValidObjectId } from 'mongoose'

export function isObjectId(id: unknown): id is mongoose.Types.ObjectId {
  return isValidObjectId(id)
}

export function isObjectIds(ids: unknown[]): ids is mongoose.Types.ObjectId[] {
  if (!Array.isArray(ids)) return false

  return ids.every(id => isValidObjectId(id))
}

export function ConstructObjectId(
  id?: string | number | mongoose.Types.ObjectId,
): mongoose.Types.ObjectId {
  if (!id) return new mongoose.Types.ObjectId()
  return new mongoose.Types.ObjectId(id)
}

export function generateObjectId(): mongoose.Types.ObjectId {
  return new mongoose.Types.ObjectId()
}

export function ConstructObjectIds(
  ids: (string | number | mongoose.Types.ObjectId)[],
): mongoose.Types.ObjectId[] {
  if (!Array.isArray(ids)) return [new mongoose.Types.ObjectId(ids)]
  return ids.map(id => {
    if (id instanceof mongoose.Types.ObjectId) return id
    return new mongoose.Types.ObjectId(id)
  })
}

export function escapeString(str: string): string {
  return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}
