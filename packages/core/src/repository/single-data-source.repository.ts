import { DeleteDataSource, GetDataSource, PutDataSource } from './data-source/data-source';
import { Operation } from './operation/operation';
import { Query } from './query/query';
import { DeleteRepository, GetRepository, PutRepository } from './repository';
import { DeviceConsoleLogger, Logger } from '../helpers';

export class SingleDataSourceRepository<T> implements GetRepository<T>, PutRepository<T>, DeleteRepository {
    constructor(
        private readonly getDataSource: GetDataSource<T>,
        private readonly putDataSource: PutDataSource<T>,
        private readonly deleteDataSource: DeleteDataSource,
        private readonly logger: Logger = new DeviceConsoleLogger(),
    ) {}

    public get(query: Query, _operation: Operation): Promise<T> {
        return this.getDataSource.get(query);
    }

    public getAll(query: Query, _operation: Operation): Promise<T[]> {
        return this.getDataSource.getAll(query);
    }

    public put(value: T, query: Query, _operation: Operation): Promise<T> {
        return this.putDataSource.put(value, query);
    }

    public putAll(values: T[], query: Query, _operation: Operation): Promise<T[]> {
        return this.putDataSource.putAll(values, query);
    }

    public delete(query: Query, _operation: Operation): Promise<void> {
        return this.deleteDataSource.delete(query);
    }
}

export class SingleGetDataSourceRepository<T> implements GetRepository<T> {
    constructor(private readonly getDataSource: GetDataSource<T>) {}

    public get(query: Query, _operation: Operation): Promise<T> {
        return this.getDataSource.get(query);
    }

    public getAll(query: Query, _operation: Operation): Promise<T[]> {
        return this.getDataSource.getAll(query);
    }
}

export class SinglePutDataSourceRepository<T> implements PutRepository<T> {
    constructor(private readonly putDataSource: PutDataSource<T>) {}

    public put(value: T, query: Query, _operation: Operation): Promise<T> {
        return this.putDataSource.put(value, query);
    }

    public putAll(values: T[], query: Query, _operation: Operation): Promise<T[]> {
        return this.putDataSource.putAll(values, query);
    }
}

export class SingleDeleteDataSourceRepository implements DeleteRepository {
    constructor(
        private readonly deleteDataSource: DeleteDataSource,
        private readonly logger: Logger = new DeviceConsoleLogger(),
    ) {}

    public delete(query: Query, _operation: Operation): Promise<void> {
        return this.deleteDataSource.delete(query);
    }
}
