import { DeleteDataSource, GetDataSource, PutDataSource } from './data-source/data-source';
import { DefaultOperation, Operation } from './operation/operation';
import { Query, VoidQuery } from './query/query';
import { DeleteRepository, GetRepository, PutRepository } from './repository';

export class SingleDataSourceRepository<T> implements GetRepository<T>, PutRepository<T>, DeleteRepository {

    constructor(
        private readonly getDataSource: GetDataSource<T>,
        private readonly putDataSource: PutDataSource<T>,
        private readonly deleteDataSource: DeleteDataSource,
    ) {}

    public get(query: Query, operation: Operation): Promise<T>;
    public get<K>(id: K, operation: Operation): Promise<T>;
    public get<K>(queryOrId: Query | K, operation: Operation): Promise<T> {
        return this.getDataSource.get(queryOrId);
    }

    public getAll(query: Query, operation: Operation): Promise<T[]>;
    public getAll<K>(ids: K[], operation: Operation): Promise<T[]>;
    public getAll<K>(queryOrId: Query | K[], operation: Operation): Promise<T[]> {
        return this.getDataSource.getAll(queryOrId);
    }

    public put(value: T, query?: Query, operation?: Operation): Promise<T>;
    public put<K>(value: T, id?: K, operation?: Operation): Promise<T>;
    public put<K>(value: T, queryOrId: Query | K = new VoidQuery(), operation: Operation = new DefaultOperation()): Promise<T> {

        return this.putDataSource.put(value, queryOrId);
    }

    public putAll(values: T[], query?: Query, operation?: Operation): Promise<T[]>;
    public putAll<K>(values: T[], ids: K[], operation: Operation): Promise<T[]>;
    public putAll<K>(values: T[], queryOrIds: Query | K[] = new VoidQuery(), operation: Operation = new DefaultOperation()): Promise<T[]>  {
        return this.putDataSource.putAll(values, queryOrIds);
    }

    public delete(query?: Query, operation?: Operation): Promise<void>;
    public delete<K>(id?: K, operation?: Operation): Promise<void>;
    public delete<K>(queryOrId: Query | K = new VoidQuery(), operation: Operation = new DefaultOperation()): Promise<void> {
        return this.deleteDataSource.delete(queryOrId);
    }

    public deleteAll(query?: Query, operation?: Operation): Promise<void>;
    public deleteAll<K>(ids?: K[], operation?: Operation): Promise<void>;
    public deleteAll<K>(queryOrIds: Query | K[] = new VoidQuery(), operation: Operation = new DefaultOperation()): Promise<void> {
        return this.deleteDataSource.deleteAll(queryOrIds);
    }

}

export class SingleGetDataSourceRepository<T> implements GetRepository<T> {

    constructor(
        private readonly getDataSource: GetDataSource<T>,
    ) {}

    public get(query: Query, operation: Operation): Promise<T>;
    public get<K>(id: K, operation: Operation): Promise<T>;
    public get<K>(queryOrId: Query | K, operation: Operation): Promise<T> {
        return this.getDataSource.get(queryOrId);
    }

    public getAll(query: Query, operation: Operation): Promise<T[]>;
    public getAll<K>(ids: K[], operation: Operation): Promise<T[]>;
    public getAll<K>(queryOrId: Query | K[], operation: Operation): Promise<T[]> {
        return this.getDataSource.getAll(queryOrId);
    }

}

export class SinglePutDataSourceRepository<T> implements PutRepository<T> {

    constructor(
        private readonly putDataSource: PutDataSource<T>,
    ) {}

    public put(value: T, query?: Query, operation?: Operation): Promise<T>;
    public put<K>(value: T, id?: K, operation?: Operation): Promise<T>;
    public put<K>(value: T, queryOrId: Query | K = new VoidQuery(), operation: Operation = new DefaultOperation()): Promise<T> {

        return this.putDataSource.put(value, queryOrId);
    }

    public putAll(values: T[], query?: Query, operation?: Operation): Promise<T[]>;
    public putAll<K>(values: T[], ids: K[], operation: Operation): Promise<T[]>;
    public putAll<K>(values: T[], queryOrIds: Query | K[] = new VoidQuery(), operation: Operation = new DefaultOperation()): Promise<T[]>  {
        return this.putDataSource.putAll(values, queryOrIds);
    }

}

export class SingleDeleteDataSourceRepository implements DeleteRepository {

    constructor(
        private readonly deleteDataSource: DeleteDataSource,
    ) {}

    public delete(query?: Query, operation?: Operation): Promise<void>;
    public delete<K>(id?: K, operation?: Operation): Promise<void>;
    public delete<K>(queryOrId: Query | K = new VoidQuery(), operation: Operation = new DefaultOperation()): Promise<void> {
        return this.deleteDataSource.delete(queryOrId);
    }

    public deleteAll(query?: Query, operation?: Operation): Promise<void>;
    public deleteAll<K>(ids?: K[], operation?: Operation): Promise<void>;
    public deleteAll<K>(queryOrIds: Query | K[] = new VoidQuery(), operation: Operation = new DefaultOperation()): Promise<void> {
        return this.deleteDataSource.deleteAll(queryOrIds);
    }
}
