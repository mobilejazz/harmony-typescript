import { ArgumentsHost, Catch, ExceptionFilter, HttpException, InternalServerErrorException, Type } from '@nestjs/common';
import { Mapper } from '@mobilejazz/harmony-core';
import { Request, Response } from 'express';
import { getI18nContextFromRequest, I18nService } from 'nestjs-i18n';
import { ErrorDto } from '../dtos/error.dto';
import { ErrorToHttpExceptionMapper } from './error-to-http-exception.mapper';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(
        private readonly toHttpExceptionMapper: Mapper<Error, HttpException>,
        private readonly i18n: I18nService,
    ) {}

    public static create(i18n: I18nService): HttpExceptionFilter {
        return new HttpExceptionFilter(new ErrorToHttpExceptionMapper(), i18n);
    }

    public async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const i18n = getI18nContextFromRequest(request);

        // Response has already been sent. Too late to catch anything.
        if (response.writableEnded) {
            return;
        }

        const httpException: HttpException = this.toHttpException(exception);
        const httpResponse = httpException.getResponse();
        let error: ErrorDto;

        if (httpResponse instanceof ErrorDto) {
            error = new ErrorDto(
                httpResponse.code,
                httpResponse.error,
                await this.i18n.translate(httpResponse.message, { lang: i18n.lang }),
            );
        } else {
            let errorName = 'Unknown Server Error';
            let errorMessage = 'Something went wrong.';

            if (typeof httpResponse['error'] === 'string') {
                errorName = httpResponse['error'];
            }

            if (
                Array.isArray(httpResponse['message']) &&
                httpResponse['message'].length > 0 &&
                typeof httpResponse['message'][0] === 'string'
            ) {
                errorMessage = httpResponse['message'].join('. ').concat('.');
            } else if (typeof httpResponse['message'] === 'string') {
                errorMessage = httpResponse['message'];
            }

            error = new ErrorDto(
                30000, // App.UNKNOWN
                errorName,
                await this.i18n.translate(errorMessage, { lang: i18n.lang }),
            );
        }

        response.status(httpException.getStatus()).json(error);
    }

    private toHttpException(exception: unknown): HttpException {
        if (exception instanceof HttpException) {
            return exception;
        } else if (exception instanceof Error) {
            return this.toHttpExceptionMapper.map(exception);
        } else {
            return new InternalServerErrorException();
        }
    }
}
