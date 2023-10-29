import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';

@ValidatorConstraint({ name: 'isCurrencyCodeValid', async: false })
class IsCurrencyCodeValidConstraint implements ValidatorConstraintInterface {
  validate(currency: string, args: ValidationArguments) {

    const allowedCurrencies = [ 'NGN','USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR',];

    return allowedCurrencies.includes(currency.toUpperCase());
  }

  defaultMessage(args: ValidationArguments) {
    return `currency must be a valid 3-letter currency code among:  NGN,USD, EUR, GBP, JPY, AUD, CAD, CHF, CNY, INR`;
  }
}


export const IsCurrencyCodeValid=(validationOptions?: ValidationOptions)=> {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCurrencyCodeValidConstraint,
    });
  };
}