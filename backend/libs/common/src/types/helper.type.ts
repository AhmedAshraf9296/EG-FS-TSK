// Remove partial modifier
export type NonPartial<T> = { [K in keyof Required<T>]: T[K] }

// Remove Partial modifier but keep undefined and null
export type NullableType<T> = {
  [K in keyof T]-?: undefined extends T[K] ? T[K] | null | undefined : T[K]
}

// Remove readonly and optional modifier
export type RequiredType<T> = {
  -readonly [K in keyof T]-?: NonNullable<T[K]>
}

// Remove read only modifier
export type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
}

// Remove optional modifier
export type NoOptionals<T> = {
  [K in keyof T]-?: T[K]
}

// Remove any nullable types
export type NonNull<T> = {
  [K in keyof T]: NonNullable<T[K]>
}

/**
 * @description Type to prettify the type of an object for debugging purposes.
 * DO NOT SLAP IT ON EVERYTHING, it will make your IDE lag, use only for debugging
 */
export type Prettify<type> = {
  [key in keyof type]: type[key]
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {}

// Removes Promise from type
export type Unpack<T> = T extends Promise<infer U> ? U : T

// Class Type
export type Class<T> = { new (...args: any[]): T }
