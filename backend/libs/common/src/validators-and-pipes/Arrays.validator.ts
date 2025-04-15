/* eslint-disable @typescript-eslint/no-unused-vars */
import { isObjectId, isObjectIds } from '@db/utils'
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator'

@ValidatorConstraint({ name: 'isArrayOfStrings', async: false })
export class IsArrayOfStringsImpl implements ValidatorConstraintInterface {
  validate(value: unknown, _args: ValidationArguments) {
    if (!value || !Array.isArray(value)) {
      return false
    }

    return value.every(element => typeof element === 'string')
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be an array of String`
  }
}

export function IsArrayOfStrings(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsArrayOfStringsImpl,
    })
  }
}

@ValidatorConstraint({ name: 'isArrayOfObjectIds', async: false })
export class IsArrayOfObjectIdsImpl implements ValidatorConstraintInterface {
  validate(
    value: unknown,
    _validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    // Handle single value
    if (!Array.isArray(value)) {
      return isObjectId(value)
    }

    return isObjectIds(value)
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be an array of ObjectIds`
  }
}

export function IsArrayOfObjectIds(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsArrayOfObjectIdsImpl,
    })
  }
}
