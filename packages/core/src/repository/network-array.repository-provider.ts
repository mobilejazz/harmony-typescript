import { GetRepository, PutRepository, Repository } from "./repository";
import { ArrayMapper, Mapper} from "./mapper/mapper";
import {
    SingleDataSourceRepository,
    SingleGetDataSourceRepository,
    SinglePutDataSourceRepository
} from "./single-data-source.repository";
import { GetRepositoryMapper, PutRepositoryMapper, RepositoryMapper } from "./repository-mapper";
import { ApiRequestService } from "./data-source/api-request.service";
import { Type } from "../helpers";
import {
    provideArrayNetworkDataSource,
    provideGetArrayNetworkDataSource,
    providePutArrayNetworkDataSource
} from "./data-source/array-network.data-source.provider";

export function provideGetArrayNetworkRepository<In, Out>(
    apiRequestService: ApiRequestService,
    toOutMapper: Mapper<In, Out>,
    type: Type<In>
): GetRepository<Out[]> {
    const networkDatasource = provideGetArrayNetworkDataSource<In>(apiRequestService, type);
    const repository = new SingleGetDataSourceRepository(networkDatasource);
    return new GetRepositoryMapper<In[], Out[]>(repository, new ArrayMapper(toOutMapper));
}

export function providePutArrayNetworkRepository<In, Out>(
    apiRequestService: ApiRequestService,
    toInMapper: Mapper<Out, In>,
    toOutMapper: Mapper<In, Out>,
    type: Type<In>
): PutRepository<Out[]> {
    const networkDatasource = providePutArrayNetworkDataSource<In>(apiRequestService, type);
    const repository = new SinglePutDataSourceRepository(networkDatasource);
    return new PutRepositoryMapper<In[], Out[]>(
        repository,
        new ArrayMapper(toOutMapper),
        new ArrayMapper(toInMapper)
    );
}

export function provideArrayNetworkRepository<In, Out>(
    apiRequestService: ApiRequestService,
    toInMapper: Mapper<Out, In>,
    toOutMapper: Mapper<In, Out>,
    type: Type<In>
): Repository<Out[]> {
    const networkDatasource = provideArrayNetworkDataSource<In>(apiRequestService, type);
    const repository = new SingleDataSourceRepository(
        networkDatasource,
        networkDatasource,
        networkDatasource
    );

    return new RepositoryMapper<In[], Out[]>(
        repository,
        repository,
        repository,
        new ArrayMapper(toOutMapper),
        new ArrayMapper(toInMapper)
    );
}
