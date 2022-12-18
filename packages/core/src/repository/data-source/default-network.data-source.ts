import { lastValueFrom, Observable } from 'rxjs';
import { ApiRequestService } from '../../../../angular/src/data/api-request.service';
import { DataSource } from './data-source';
import { NetworkQuery, Query } from '../query/query';
import { MethodNotImplementedError, QueryNotSupportedError } from '../errors';

export class DefaultNetworkDataSource<T> implements DataSource<unknown> {
    constructor(private readonly requestService: ApiRequestService) {}

    public async get(query: Query): Promise<unknown> {
        if (query instanceof NetworkQuery) {
            const res = await lastValueFrom(
                this.requestService
                    .builder<unknown>(query.endpoint)
                    .setQueryParameters(query.queryParameters)
                    .setUrlParameters(query.urlParameters)
                    .get(),
            );

            if (!res) {
                // TODO check the specific error
                throw Error();
            }

            return res;
        }

        throw new QueryNotSupportedError();
    }

    public async getAll(_query: Query): Promise<unknown[]> {
        throw new MethodNotImplementedError();
    }

    public async put(value: unknown | undefined, query: Query): Promise<unknown> {
        if (query instanceof NetworkQuery) {
            let res$: Observable<T | undefined>;
            const request = this.requestService
                .builder<unknown>(query.endpoint)
                .setQueryParameters(query.queryParameters)
                .setUrlParameters(query.urlParameters);

            if (value) {
                res$ = request.setBody(query.body).post();
            } else {
                res$ = request.setBody(query.body).put();
            }

            const res = await lastValueFrom(res$);

            if (!res) {
                // TODO check the specific error
                throw Error();
            }

            return res;
        }

        throw new QueryNotSupportedError();
    }

    public async putAll(_values: unknown[] | undefined, _query: Query): Promise<unknown[]> {
        throw new MethodNotImplementedError();
    }

    public async delete(query: Query): Promise<void> {
        if (query instanceof NetworkQuery) {
            await lastValueFrom(
                this.requestService
                    .builder<void>(query.endpoint)
                    .setQueryParameters(query.queryParameters)
                    .setUrlParameters(query.urlParameters)
                    .delete(),
            );
        }

        throw new QueryNotSupportedError();
    }
}
