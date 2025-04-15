/* eslint-disable @typescript-eslint/no-unused-vars */
import { isObjectId } from '@db/utils'
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'

@ValidatorConstraint({ async: false })
export class IsObjectIdConstraint implements ValidatorConstraintInterface {
  validate(value: any, _args: ValidationArguments) {
    return isObjectId(value)
  }

  defaultMessage(_args: ValidationArguments) {
    return 'Invalid ObjectId format'
  }
}

export function IsObjectId(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsObjectIdConstraint,
    })
  }
}
