import {
    ArrayMapper,
    DataSource,
    Mapper,
    MethodNotImplementedError,
    NetworkQuery,
    Query,
    QueryNotSupportedError,
} from '@mobilejazz/harmony-core';
import { lastValueFrom } from 'rxjs';
import { ApiRequestService } from '../api-request.service';

// TODO: Move to `harmony-core`
export class DefaultArrayNetworkDataSource<T> implements DataSource<T[]> {
    private arrayMapper: ArrayMapper<unknown, T>;

    constructor(private readonly requestService: ApiRequestService, private readonly mapper: Mapper<unknown, T>) {
        this.arrayMapper = new ArrayMapper(mapper);
    }

    public async get(query: Query): Promise<T[]> {
        if (query instanceof NetworkQuery) {
            const res = await lastValueFrom(
                this.requestService
                    .builder<T[]>(query.endpoint)
                    .setMapper<T[]>(this.arrayMapper)
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

    public async getAll(_query: Query): Promise<T[][]> {
        throw new MethodNotImplementedError();
    }

    public async put(value: T[] | undefined, query: Query): Promise<T[]> {
        /*if (query instanceof NetworkQuery) {
            let res$: Observable<T | undefined>;
            const request = this.requestService
                .builder<T>(query.endpoint)
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
        }*/

        throw new QueryNotSupportedError();
    }

    public async putAll(_values: T[][] | undefined, _query: Query): Promise<T[][]> {
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
