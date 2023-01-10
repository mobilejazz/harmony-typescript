import { lastValueFrom, Observable } from 'rxjs';
import { DataSource } from './data-source';
import { Query } from '../query/query';
import { MethodNotImplementedError, QueryNotSupportedError } from '../errors';
import { DataSourceMapper } from './data-source-mapper';
import { ArrayMapper, JsonDeserializerMapper, VoidMapper } from '../mapper/mapper';
import { Type } from '../../helpers';
import {
    DeleteNetworkQuery,
    GetNetworkQuery,
    NetworkQuery,
    PostNetworkQuery,
    PutNetworkQuery,
} from '../query/network-query';
import { ApiRequestService } from './api-request.service';
import { HttpRequestBuilder } from '../../data';

export class NetworkDataSource implements DataSource<unknown> {
    constructor(private readonly requestService: ApiRequestService) {}

    public get(query: Query): Promise<unknown> {
        if (query instanceof GetNetworkQuery) {
            return lastValueFrom(this.getRequestWithParameters(query).get());
        }

        throw new QueryNotSupportedError();
    }

    public put(value: unknown | undefined, query: Query): Promise<unknown> {
        let $request: Observable<unknown>;
        if (query instanceof PutNetworkQuery) {
            $request = this.getRequestWithParameters<void>(query).put();
        } else if (query instanceof PostNetworkQuery) {
            $request = this.getRequestWithParameters<void>(query).post();
        } else {
            throw new QueryNotSupportedError();
        }

        return lastValueFrom($request);
    }

    public delete(query: Query): Promise<void> {
        if (query instanceof DeleteNetworkQuery) {
            return lastValueFrom(this.getRequestWithParameters<void>(query).delete());
        }

        throw new QueryNotSupportedError();
    }

    private getRequestWithParameters<T extends unknown | void>(
        query: NetworkQuery,
        value?: unknown | undefined,
    ): HttpRequestBuilder<T> {
        const request = this.requestService
            .builder<T>(query.endpoint)
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
        new VoidMapper(),
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
        new ArrayMapper(
            new JsonDeserializerMapper(type),
        ),
        new VoidMapper(),
    );
}
