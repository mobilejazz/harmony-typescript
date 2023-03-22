import { DeleteRepository, GetRepository, PutRepository } from "./repository";
import { Mapper } from "./mapper/mapper";
import {
    SingleDataSourceRepository,
    SingleDeleteDataSourceRepository,
    SingleGetDataSourceRepository,
    SinglePutDataSourceRepository
} from "./single-data-source.repository";
import { GetRepositoryMapper, PutRepositoryMapper, RepositoryMapper } from "./repository-mapper";
import { ApiRequestService } from "./data-source/api-request.service";
import { Type } from "../helpers";
import {
    provideDeleteNetworkDataSource,
    provideGetNetworkDataSource,
    provideNetworkDataSource,
    providePutNetworkDataSource
} from "./data-source/network.data-source.provider";

export function provideGetNetworkRepository<In, Out>(
    apiRequestService: ApiRequestService,
    toOutMapper: Mapper<In, Out>,
    type?: Type<In>
): GetRepository<Out> {
    const networkDatasource = provideGetNetworkDataSource<In>(apiRequestService, type);
    const repository = new SingleGetDataSourceRepository(networkDatasource);
    return new GetRepositoryMapper<In, Out>(repository, toOutMapper);
}

export function providePutNetworkRepository<In, Out>(
    apiRequestService: ApiRequestService,
    toInMapper: Mapper<Out, In>,
    toOutMapper: Mapper<In, Out>,
    type?: Type<In>
): PutRepository<Out> {
    const networkDatasource = providePutNetworkDataSource<In>(apiRequestService, type);
    const repository = new SinglePutDataSourceRepository(networkDatasource);
    return new PutRepositoryMapper<In, Out>(repository, toOutMapper, toInMapper);
}

export function provideDeleteNetworkRepository(
    apiRequestService: ApiRequestService
): DeleteRepository {
    const networkDatasource = provideDeleteNetworkDataSource(apiRequestService);
    return new SingleDeleteDataSourceRepository(networkDatasource);
}

export function provideNetworkRepository<In, Out>(
    apiRequestService: ApiRequestService,
    toInMapper: Mapper<Out, In>,
    toOutMapper: Mapper<In, Out>,
    type?: Type<In>
): PutRepository<Out> {
    const networkDatasource = provideNetworkDataSource<In>(apiRequestService, type);
    const repository = new SingleDataSourceRepository(
        networkDatasource,
        networkDatasource,
        networkDatasource
    );

    return new RepositoryMapper<In, Out>(
        repository,
        repository,
        repository,
        toOutMapper,
        toInMapper
    );
}
