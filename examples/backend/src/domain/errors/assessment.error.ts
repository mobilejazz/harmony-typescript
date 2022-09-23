import { FailedError } from '@mobilejazz/harmony-core';
import { DomainError } from '../domain.error';

export class InvalidEmailError extends FailedError {
  constructor() {
    super(
      'domain-error.INVALID_EMAIL',
      DomainError.INVALID_EMAIL,
    );
    Object.setPrototypeOf(this, InvalidEmailError.prototype);
  }
}
