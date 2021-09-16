import { Operation } from './operation/operation';
import { Query } from './query/query';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Repository {}

export interface GetRepository<T> extends Repository {
    get(query: Query, operation: Operation): Promise<T>;
    getAll(query: Query, operation: Operation): Promise<T[]>;
}

export interface PutRepository<T> extends Repository {
    put(value: T, query: Query, operation: Operation): Promise<T>;
    putAll(values: T[], query: Query, operation: Operation): Promise<T[]>;
}

export interface DeleteRepository extends Repository {
    delete(query: Query, operation: Operation): Promise<void>;
    deleteAll(query: Query, operation: Operation): Promise<void>;
}
