import {
    DeleteDataSource,
    GetDataSource,
    Mapper,
    MethodNotImplementedError,
    NetworkQuery,
    PutDataSource,
    Query,
    QueryNotSupportedError,
} from '@mobilejazz/harmony-core';
import { lastValueFrom } from 'rxjs';
import { ApiRequestService } from "../api-request.service";

export class DefaultNetworkDataSource<T> implements GetDataSource<T>, PutDataSource<T>, DeleteDataSource {
    constructor(
        private readonly requestService: ApiRequestService,
        private readonly mapper: Mapper<unknown, T>,
    ) {}

    public async get(query: Query): Promise<T> {
        if (query instanceof NetworkQuery) {
            const res = await lastValueFrom(this.requestService
                .builder<T>(query.endpoint)
                .setMapper(this.mapper)
                .setQueryParameters(
                    query.queryParameters
                )
                .setUrlParameters(
                    query.urlParameters
                )
                .get());

            if (!res) {
                // TODO check the specific error
                throw Error();
            }

            return res;
        }
        throw new QueryNotSupportedError();
    }

    public async getAll(query: Query): Promise<T[]> {
        throw new MethodNotImplementedError();
    }

    public async put(value: T | undefined, query: Query): Promise<T> {
        if (query instanceof NetworkQuery) {
            const request = this.requestService
                .builder<T>(query.endpoint)
                .setQueryParameters(query.queryParameters)
                .setUrlParameters(query.urlParameters);

            if (!!value) {
                request
                    .setBody(query.body)
                    .post();
            } else {
                request
                    .setBody(query.body)
                    .put();
            }
            return lastValueFrom(request.put());
        }
        throw new QueryNotSupportedError();
    }

    public async putAll(values: T[] | undefined, query: Query): Promise<T[]> {
        throw new MethodNotImplementedError();
    }

    public async delete(query: Query): Promise<void> {
        if (query instanceof NetworkQuery) {
            await lastValueFrom(this.requestService
                .builder<void>(query.endpoint)
                .setQueryParameters(
                    query.queryParameters
                )
                .setUrlParameters(
                    query.urlParameters
                )
                .delete());
        }
        throw new QueryNotSupportedError();
    }
}
