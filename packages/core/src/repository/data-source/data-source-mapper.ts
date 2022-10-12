import { Mapper, Query } from '..';
import { DeleteDataSource, GetDataSource, PutDataSource } from './data-source';
import { DeviceConsoleLogger, Logger } from '../../helpers';

/**
 * This data source uses mappers to map objects and redirects them to the contained data source, acting as a simple "translator".
 *
 * @param getDataSource Data source with get operations
 * @param putDataSource Data source with put operations
 * @param deleteDataSource Data source with delete operations
 * @param toOutMapper Mapper to map data source objects to repository objects
 * @param toInMapper Mapper to map repository objects to data source objects
 */
export class DataSourceMapper<In, Out> implements GetDataSource<Out>, PutDataSource<Out>, DeleteDataSource {
    private readonly getMapper: GetDataSourceMapper<In, Out>;
    private readonly putMapper: PutDataSourceMapper<In, Out>;

    constructor(
        getDataSource: GetDataSource<In>,
        putDataSource: PutDataSource<In>,
        private readonly deleteDataSource: DeleteDataSource,
        toOutMapper: Mapper<In, Out>,
        toInMapper: Mapper<Out, In>,
        private readonly logger: Logger = new DeviceConsoleLogger(),
    ) {
        this.getMapper = new GetDataSourceMapper(getDataSource, toOutMapper);
        this.putMapper = new PutDataSourceMapper(putDataSource, toOutMapper, toInMapper);
    }

    public get(query: Query): Promise<Out> {
        return this.getMapper.get(query);
    }

    public getAll(query: Query): Promise<Out[]> {
        return this.getMapper.getAll(query);
    }

    public put(value: Out | undefined, query: Query): Promise<Out> {
        return this.putMapper.put(value, query);
    }

    public putAll(values: Out[] | undefined, query: Query): Promise<Out[]> {
        return this.putMapper.putAll(values, query);
    }

    public delete(query: Query): Promise<void> {
        return this.deleteDataSource.delete(query);
    }
}

/**
 * This data source uses mappers to map objects and redirects them to the contained data source, acting as a simple "translator".
 *
 * @param getDataSource Data source with get operations
 * @param toOutMapper Mapper to map data source objects to repository objects
 */
export class GetDataSourceMapper<In, Out> implements GetDataSource<Out> {
    constructor(private readonly getDataSource: GetDataSource<In>, private readonly toOutMapper: Mapper<In, Out>) {}

    public async get(query: Query): Promise<Out> {
        const result: In = await this.getDataSource.get(query);
        return this.toOutMapper.map(result);
    }

    public async getAll(query: Query): Promise<Out[]> {
        const results: In[] = await this.getDataSource.getAll(query);
        return results.map((r: In) => this.toOutMapper.map(r));
    }
}

/**
 * This data source uses mappers to map objects and redirects them to the contained data source, acting as a simple "translator".
 *
 * @param putDataSource Data source with put operations
 * @param toOutMapper Mapper to map data source objects to repository objects
 * @param toInMapper Mapper to map repository objects to data source objects
 */
export class PutDataSourceMapper<In, Out> implements PutDataSource<Out> {
    constructor(
        private readonly putDataSource: PutDataSource<In>,
        private readonly toOutMapper: Mapper<In, Out>,
        private readonly toInMapper: Mapper<Out, In>,
    ) {}

    public async put(value: Out | undefined, query: Query): Promise<Out> {
        const mapped: In | undefined = value ? this.toInMapper.map(value) : undefined;
        const result: In = await this.putDataSource.put(mapped, query);
        return this.toOutMapper.map(result);
    }

    public async putAll(values: Out[] | undefined, query: Query): Promise<Out[]> {
        const mapped: In[] | undefined = values ? values.map((v) => this.toInMapper.map(v)) : undefined;
        const results: In[] = await this.putDataSource.putAll(mapped, query);
        return results.map((r: In) => this.toOutMapper.map(r));
    }
}
