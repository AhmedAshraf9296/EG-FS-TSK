type MethodNames<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never
}[keyof T]

type MethodSubset<T, K extends keyof T> = {
  [P in K]: T[P]
}

export function PickMethods<T, K extends MethodNames<T>>(
  baseClass: new (...params: any[]) => T,
  methodsToInclude: K[],
): new () => MethodSubset<T, K> {
  class ExtendedClass {
    constructor() {
      // You can initialize properties or perform other actions in the constructor if needed
    }
  }

  // Using reflection get class metadata, add metadata to new class
  const metadataKeys = Reflect.getMetadataKeys(baseClass)
  metadataKeys.forEach(key => {
    const metadata = Reflect.getMetadata(key, baseClass)
    Reflect.defineMetadata(key, metadata, ExtendedClass)
  })

  // Get Properties from base class and add to new class
  const properties = Object.getOwnPropertyNames(baseClass)
  properties
    .filter(
      propertyName => !['length', 'prototype', 'name'].includes(propertyName),
    )
    .forEach(propertyName => {
      const propertyDescriptor = Object.getOwnPropertyDescriptor(
        baseClass,
        propertyName,
      )
      if (propertyDescriptor) {
        // Get Metadata for property and add to new class
        Object.defineProperty(ExtendedClass, propertyName, propertyDescriptor)
        // const metadataKeys = Reflect.getMetadataKeys(baseClass, propertyName)
        // metadataKeys.forEach(key => {
        //   const metadata = Reflect.getMetadata(key, baseClass, propertyName)
        //   Reflect.defineMetadata(key, metadata, ExtendedClass, propertyName)
        // })
      }
    })

  methodsToInclude.forEach(methodName => {
    const method = baseClass.prototype[methodName]
    if (method) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ExtendedClass.prototype[methodName] = method
      // Get Metadata of method parameters and add to new class
      const metadataKeys = Reflect.getMetadataKeys(
        baseClass.prototype,
        methodName as any,
      )
      metadataKeys.forEach(key => {
        const metadata = Reflect.getMetadata(
          key,
          baseClass.prototype,
          methodName as any,
        )
        Reflect.defineMetadata(
          key,
          metadata,
          ExtendedClass.prototype,
          methodName as any,
        )
      })
    }
  })

  return ExtendedClass as new () => MethodSubset<T, K>
}
