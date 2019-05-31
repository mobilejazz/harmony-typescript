import { OperationNotSupportedError } from './errors';
import { DefaultOperation, Operation } from './operation/operation';
import { Query, VoidQuery } from './query/query';
import { DeleteRepository, GetRepository, PutRepository } from './repository';

export class VoidRepository<T> implements GetRepository<T>, PutRepository<T>, DeleteRepository {
    public get(query: Query, operation: Operation): Promise<T>;
    public get<K>(id: K, operation: Operation): Promise<T>;
    public get<K>(queryOrId: Query | K, operation: Operation): Promise<T> {
        throw new OperationNotSupportedError();
    }
    public getAll(query: Query, operation: Operation): Promise<T[]>;
    public getAll<K>(id: K[], operation: Operation): Promise<T[]>;
    public getAll<K>(queryOrIds: Query | K[], operation: Operation): Promise<T[]> {
        throw new OperationNotSupportedError();
    }
    public put(value: T, query?: Query, operation?: Operation): Promise<T>;
    public put<K>(value: T, id?: K, operation?: Operation): Promise<T>;
    public put<K>(value: T, queryOrId: Query | K = new VoidQuery(), operation: Operation = new DefaultOperation()): Promise<T> {
        throw new OperationNotSupportedError();
    }
    public putAll(values: T[], query?: Query, operation?: Operation): Promise<T[]>;
    public putAll<K>(values: T[], id?: K[], operation?: Operation): Promise<T[]>;
    public putAll<K>(values: T[], queryOrIds: Query | K[] = new VoidQuery(), operation: Operation = new DefaultOperation()): Promise<T[]> {
        throw new OperationNotSupportedError();
    }
    public delete(query: Query, operation: Operation): Promise<boolean>;
    public delete<K>(id: K, operation: Operation): Promise<boolean>;
    public delete<K>(queryOrId: Query | K, operation: Operation): Promise<boolean> {
        throw new OperationNotSupportedError();
    }
    public deleteAll(query: Query, operation: Operation): Promise<boolean>;
    public deleteAll<K>(ids: K[], operation: Operation): Promise<boolean>;
    public deleteAll<K>(queryOrIds: Query | K[], operation: Operation): Promise<boolean> {
        throw new OperationNotSupportedError();
    }
}

export class VoidGetRepository<T> implements GetRepository<T> {
    public get(query: Query, operation: Operation): Promise<T>;
    public get<K>(id: K, operation: Operation): Promise<T>;
    public get<K>(queryOrId: Query | K, operation: Operation): Promise<T> {
        throw new OperationNotSupportedError();
    }
    public getAll(query: Query, operation: Operation): Promise<T[]>;
    public getAll<K>(id: K[], operation: Operation): Promise<T[]>;
    public getAll<K>(queryOrIds: Query | K[], operation: Operation): Promise<T[]> {
        throw new OperationNotSupportedError();
    }
}

export class VoidPutRepository<T> implements PutRepository<T> {
    public put(value: T, query?: Query, operation?: Operation): Promise<T>;
    public put<K>(value: T, id?: K, operation?: Operation): Promise<T>;
    public put<K>(value: T, queryOrId: Query | K = new VoidQuery(), operation: Operation = new DefaultOperation()): Promise<T> {
        throw new OperationNotSupportedError();
    }
    public putAll(values: T[], query?: Query, operation?: Operation): Promise<T[]>;
    public putAll<K>(values: T[], id?: K[], operation?: Operation): Promise<T[]>;
    public putAll<K>(values: T[], queryOrIds: Query | K[] = new VoidQuery(), operation: Operation = new DefaultOperation()): Promise<T[]> {
        throw new OperationNotSupportedError();
    }
}

export class VoidDeleteRepository implements DeleteRepository {
    public delete(query: Query, operation: Operation): Promise<boolean>;
    public delete<K>(id: K, operation: Operation): Promise<boolean>;
    public delete<K>(queryOrId: Query | K, operation: Operation): Promise<boolean> {
        throw new OperationNotSupportedError();
    }
    public deleteAll(query: Query, operation: Operation): Promise<boolean>;
    public deleteAll<K>(ids: K[], operation: Operation): Promise<boolean>;
    public deleteAll<K>(queryOrIds: Query | K[], operation: Operation): Promise<boolean> {
        throw new OperationNotSupportedError();
    }
}
