import { lastValueFrom, Observable } from 'rxjs';
import { DataSource } from './data-source';
import { Query } from '../query/query';
import { InvalidHttpMethodError, MethodNotImplementedError, QueryNotSupportedError } from '../errors';
import { DataSourceMapper } from './data-source-mapper';
import { ArrayMapper, BlankMapper, JsonDeserializerMapper } from '../mapper/mapper';
import { Type } from '../../helpers';
import { ApiRequestService } from './api-request.service';
import { HttpRequestBuilder } from '../../data';
import { HttpMethod, NetworkQuery } from '../query/network.query';

export class NetworkDataSource implements DataSource<unknown> {
    constructor(private readonly requestService: ApiRequestService) {}

    public async get(query: Query): Promise<unknown> {
        if (query instanceof NetworkQuery) {
            if (query.method === HttpMethod.Get) {
                return lastValueFrom(this.getRequestWithParameters<unknown>(query).get());
            }
            throw new InvalidHttpMethodError(`Only GET method is allowed in a get action, using ${query.method}`);
        }
        throw new QueryNotSupportedError();
    }

    public put(value: unknown | undefined, query: Query): Promise<unknown> {
        let $request: Observable<unknown>;
        if (query instanceof NetworkQuery) {
            if (query.method === HttpMethod.Post) {
                $request = this.getRequestWithParameters<unknown>(query).post();
            } else if (query.method === HttpMethod.Put) {
                $request = this.getRequestWithParameters<unknown>(query, value).put();
            } else {
                throw new InvalidHttpMethodError(
                    `Only POST & PUT methods are allowed in a put action, using ${query.method}`,
                );
            }
        } else {
            throw new QueryNotSupportedError();
        }

        return lastValueFrom($request);
    }

    public delete(query: Query): Promise<void> {
        if (query instanceof NetworkQuery) {
            if (query.method === HttpMethod.Delete) {
                return lastValueFrom(this.getRequestWithParameters<void>(query).delete());
            }
            throw new InvalidHttpMethodError(`Only DELETE method is allowed in a delete action, using ${query.method}`);
        }

        throw new QueryNotSupportedError();
    }

    private getRequestWithParameters<T extends unknown | void>(
        query: NetworkQuery,
        value?: unknown | undefined,
    ): HttpRequestBuilder<T> {
        const request = this.requestService
            .builder<T>(query.path)
            .setQueryParameters(query.queryParameters)
            .setUrlParameters(query.urlParameters);

        if (value) {
            request.setBody(value);
        } else {
            request.setBody(query.body);
        }

        return request;
    }

    public async getAll(_query: Query): Promise<unknown[]> {
        throw new MethodNotImplementedError();
    }

    public async putAll(_values: unknown[] | undefined, _query: Query): Promise<unknown[]> {
        throw new MethodNotImplementedError();
    }
}

export function provideDefaultNetworkDataSource<T>(requestService: ApiRequestService, type: Type<T>): DataSource<T> {
    const dataSource = new NetworkDataSource(requestService);
    return new DataSourceMapper<unknown, T>(
        dataSource,
        dataSource,
        dataSource,
        new JsonDeserializerMapper(type),
        new BlankMapper<T>(),
    );
}

export function provideDefaultArrayNetworkDataSource<T>(
    requestService: ApiRequestService,
    type: Type<T>,
): DataSource<T[]> {
    const dataSource = new NetworkDataSource(requestService);
    return new DataSourceMapper(
        dataSource,
        dataSource,
        dataSource,
        new ArrayMapper(new JsonDeserializerMapper(type)),
        new ArrayMapper(new BlankMapper()),
    );
}
