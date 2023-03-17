import { DeleteDataSource, GetDataSource, PutDataSource } from './data-source/data-source';
import { Operation } from './operation/operation';
import { Query } from './query/query';
import { DeleteRepository, GetRepository, PutRepository, Repository } from './repository';

export class SingleDataSourceRepository<T> implements Repository<T> {
    constructor(
        private readonly getDataSource: GetDataSource<T>,
        private readonly putDataSource: PutDataSource<T>,
        private readonly deleteDataSource: DeleteDataSource,
    ) {}

    public get(query: Query, _operation: Operation): Promise<T> {
        return this.getDataSource.get(query);
    }

    public put(value: T | undefined, query: Query, _operation: Operation): Promise<T> {
        return this.putDataSource.put(value, query);
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
}

export class SinglePutDataSourceRepository<T> implements PutRepository<T> {
    constructor(private readonly putDataSource: PutDataSource<T>) {}

    public put(value: T | undefined, query: Query, _operation: Operation): Promise<T> {
        return this.putDataSource.put(value, query);
    }
}

export class SingleDeleteDataSourceRepository implements DeleteRepository {
    constructor(private readonly deleteDataSource: DeleteDataSource) {}

    public delete(query: Query, _operation: Operation): Promise<void> {
        return this.deleteDataSource.delete(query);
    }
}
