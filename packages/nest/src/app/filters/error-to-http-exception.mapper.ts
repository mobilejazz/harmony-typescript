import {
    BadRequestException, ForbiddenException,
    HttpException,
    InternalServerErrorException,
    NotFoundException,
    NotImplementedException,
} from '@nestjs/common';
import {
    Mapper,
    FailedError,
    InvalidArgumentError,
    MethodNotImplementedError,
    NotFoundError,
    NotValidError,
    ForbiddenError,
    OperationNotSupportedError,
    QueryNotSupportedError,
} from '@mobilejazz/harmony-core';
import { ErrorDto } from '../dtos/error.dto';

export class ErrorToHttpExceptionMapper implements Mapper<Error, HttpException> {
    public map(from: Error): HttpException {
        const getBody = (code: number, error: string, message: string) => {
            if (code < 0) {
                // O is the default generic error
                return new ErrorDto(0, error, message);
            }
            return new ErrorDto(code, error, message);
        };

        if (from instanceof MethodNotImplementedError) {
            return new NotImplementedException(getBody(from.code, from.name, from.message));
        }

        if (from instanceof OperationNotSupportedError) {
            return new NotImplementedException(getBody(from.code, from.name, from.message));
        }

        if (from instanceof QueryNotSupportedError) {
            return new NotImplementedException(getBody(from.code, from.name, from.message));
        }

        if (from instanceof NotFoundError) {
            return new NotFoundException(getBody(from.code, from.name, from.message));
        }

        if (from instanceof NotValidError) {
            return new BadRequestException(getBody(from.code, from.name, from.message));
        }

        if (from instanceof InvalidArgumentError) {
            return new BadRequestException(getBody(from.code, from.name, from.message));
        }

        if (from instanceof FailedError) {
            return new BadRequestException(getBody(from.code, from.name, from.message));
        }

        if (from instanceof ForbiddenError) {
            return new ForbiddenException(getBody(from.code, from.name, from.message));
        }

        return new InternalServerErrorException(getBody(0, from.name, from.message));
    }
}
