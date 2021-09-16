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
    constructor(
        private readonly getDataSource: GetDataSource<In>,
        private readonly putDataSource: PutDataSource<In>,
        private readonly deleteDataSource: DeleteDataSource,
        private readonly toOutMapper: Mapper<In, Out>,
        private readonly toInMapper: Mapper<Out, In>,
        private readonly logger: Logger = new DeviceConsoleLogger(),
    ) {}

    public async get(query: Query): Promise<Out> {
        const result: In = await this.getDataSource.get(query);
        return this.toOutMapper.map(result);
    }

    public async getAll(query: Query): Promise<Out[]> {
        const results: In[] = await this.getDataSource.getAll(query);
        return results.map((r: In) => this.toOutMapper.map(r));
    }

    public async put(value: Out, query: Query): Promise<Out> {
        const mapped: In = value ? this.toInMapper.map(value) : undefined;
        const result: In = await this.putDataSource.put(mapped, query);
        return this.toOutMapper.map(result);
    }

    public async putAll(values: Out[], query: Query): Promise<Out[]> {
        const mapped: In[] = values ? values.map((v) => (v ? this.toInMapper.map(v) : undefined)) : undefined;
        const results: In[] = await this.putDataSource.putAll(mapped, query);
        return results.map((r: In) => this.toOutMapper.map(r));
    }

    public delete(query: Query): Promise<void> {
        return this.deleteDataSource.delete(query);
    }

    public deleteAll(query: Query): Promise<void> {
        // tslint:disable-next-line:max-line-length
        this.logger.warning('[DEPRECATION] `deleteAll` will be deprecated. Calling `delete` instead.');
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

    public async put(value: Out, query: Query): Promise<Out> {
        const mapped: In = value ? this.toInMapper.map(value) : undefined;
        const result: In = await this.putDataSource.put(mapped, query);
        return this.toOutMapper.map(result);
    }

    public async putAll(values: Out[], query: Query): Promise<Out[]> {
        const mapped: In[] = values ? values.map((v) => this.toInMapper.map(v)) : undefined;
        const results: In[] = await this.putDataSource.putAll(mapped, query);
        return results.map((r: In) => this.toOutMapper.map(r));
    }
}
