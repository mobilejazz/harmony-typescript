import { ApiRequestService } from "./api-request.service";
import { Type } from "../../helpers";
import { DataSource, GetDataSource, PutDataSource } from "./data-source";
import { NetworkDataSource } from "./network.data-source";
import { DataSourceMapper, GetDataSourceMapper, PutDataSourceMapper } from "./data-source-mapper";
import { ArrayMapper, BlankMapper, JsonDeserializerMapper } from "../mapper/mapper";

export function provideGetArrayNetworkDataSource<T extends unknown | void>(
    requestService: ApiRequestService,
    type?: Type<T>,
): GetDataSource<T[]> {
    const dataSource = new NetworkDataSource(requestService);
    return new GetDataSourceMapper(
        dataSource,
        type
            ? new ArrayMapper(new JsonDeserializerMapper(type))
            : new ArrayMapper(new BlankMapper())
    );
}

export function providePutArrayNetworkDataSource<T extends unknown | void>(
    requestService: ApiRequestService,
    type?: Type<T>,
): PutDataSource<T[]> {
    const dataSource = new NetworkDataSource(requestService);
    return new PutDataSourceMapper(
        dataSource,
        type
            ? new ArrayMapper(new JsonDeserializerMapper(type))
            : new ArrayMapper(new BlankMapper()),
        new ArrayMapper(new BlankMapper()),
    );
}

export function provideArrayNetworkDataSource<T extends unknown | void>(
    requestService: ApiRequestService,
    type?: Type<T>,
): DataSource<T[]> {
    const dataSource = new NetworkDataSource(requestService);
    return new DataSourceMapper(
        dataSource,
        dataSource,
        dataSource,
        type
            ? new ArrayMapper(new JsonDeserializerMapper(type))
            : new ArrayMapper(new BlankMapper()),
        new ArrayMapper(new BlankMapper()),
    );
}
