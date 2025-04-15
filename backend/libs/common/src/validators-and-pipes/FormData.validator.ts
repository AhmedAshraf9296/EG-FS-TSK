import { Logger } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  validate,
} from 'class-validator'

function isArrayOfFormDataImplFunc(obj: any) {
  @ValidatorConstraint({ name: 'isArrayOfFormData', async: true })
  class IsArrayOfFormDataImpl implements ValidatorConstraintInterface {
    private logger = new Logger(IsArrayOfFormDataImpl.name)
    async validate(
      value: unknown[],
      _validationArguments?: ValidationArguments,
    ): Promise<boolean> {
      try {
        const toValidateValue = value
        if (!Array.isArray(toValidateValue)) return false

        const errsArr: string[] = []

        for (const item of toValidateValue) {
          const errors = await validate(plainToInstance(item as any, obj))
          if (errors.length > 0) {
            errsArr.push(
              ...errors
                .map(e => e.constraints)
                .filter(Boolean)
                .join(','),
            )
          }
        }

        this.logger.debug('isArrayOfFormDataImplFunc >>', errsArr)
        return errsArr.length === 0
      } catch (e) {
        this.logger.error(e)
        // Json.parse failed
        return false
      }
    }

    defaultMessage(args: ValidationArguments): string {
      return `${args.property} must be an array of ${obj.name}`
    }
  }

  return IsArrayOfFormDataImpl
}

export function IsArrayOfFormDataObjects<T>(
  obj: T,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: isArrayOfFormDataImplFunc(obj),
    })
  }
}
