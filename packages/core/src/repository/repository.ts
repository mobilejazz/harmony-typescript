import { Operation } from './operation/operation';
import { Query } from './query/query';

export interface Repository {}

export interface GetRepository<T> extends Repository {
    get(query: Query, operation: Operation): Promise<T>;
    get<K>(id: K, operation: Operation): Promise<T>;

    getAll(query: Query, operation: Operation): Promise<T[]>;
    getAll<K>(ids: K[], operation: Operation): Promise<T[]>;
}

export interface PutRepository<T> extends Repository {
    put(value: T, query: Query, operation: Operation): Promise<T>;
    put<K>(value: T, id: K, operation: Operation): Promise<T>;

    putAll(values: T[], query: Query, operation: Operation): Promise<T[]>;
    putAll<K>(values: T[], ids: K[], operation: Operation): Promise<T[]>;
}

export interface DeleteRepository extends Repository {
    delete(query: Query, operation: Operation): Promise<boolean>;
    delete<K>(id: K, operation: Operation): Promise<boolean>;

    deleteAll(query: Query, operation: Operation): Promise<boolean>;
    deleteAll<K>(ids: K[], operation: Operation): Promise<boolean>;
}

export const OperationNotSupportedError = new Error('Operation Not Supported');
export const QueryNotSupportedError = new Error('Query Not Supported');
