import { ApiRequestService } from "./api-request.service";
import { Type } from "../../helpers";
import { DataSource, DeleteDataSource, GetDataSource, PutDataSource } from "./data-source";
import { NetworkDataSource } from "./network.data-source";
import { DataSourceMapper, GetDataSourceMapper, PutDataSourceMapper } from "./data-source-mapper";
import { BlankMapper, JsonDeserializerMapper } from "../mapper/mapper";

export function provideNetworkDataSource<T extends unknown | void>(requestService: ApiRequestService, type?: Type<T>): DataSource<T> {
    const dataSource = new NetworkDataSource(requestService);
    return new DataSourceMapper(
        dataSource,
        dataSource,
        dataSource,
        type ? new JsonDeserializerMapper(type) : new BlankMapper<T>(),
        new BlankMapper<T>(),
    );
}

export function provideGetNetworkDataSource<T extends unknown | void>(requestService: ApiRequestService, type?: Type<T>): GetDataSource<T> {
    const dataSource = new NetworkDataSource(requestService);
    return new GetDataSourceMapper(
        dataSource,
        type ? new JsonDeserializerMapper(type) : new BlankMapper<T>(),
    );
}

export function providePutNetworkDataSource<T extends unknown | void>(requestService: ApiRequestService, type?: Type<T>): PutDataSource<T> {
    const dataSource = new NetworkDataSource(requestService);
    return new PutDataSourceMapper(
        dataSource,
        type ? new JsonDeserializerMapper(type) : new BlankMapper<T>(),
        new BlankMapper<T>(),
    );
}

export function provideDeleteNetworkDataSource(requestService: ApiRequestService): DeleteDataSource {
    return new NetworkDataSource(requestService);
}

