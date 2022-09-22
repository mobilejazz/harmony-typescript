import { Operation } from './operation/operation';
import { Query } from './query/query';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Repository {}

export interface GetRepository<T> extends Repository {
    get: (query: Query, operation: Operation) => Promise<T>;
    /**
     * @deprecated please use get with an array type instead
     */
    getAll: (query: Query, operation: Operation) => Promise<T[]>;
}

export interface PutRepository<T> extends Repository {
    put: (value: T | undefined, query: Query, operation: Operation) => Promise<T>;
    /**
     * @deprecated please use put with an array type instead
     */
    putAll: (values: T[] | undefined, query: Query, operation: Operation) => Promise<T[]>;
}

export interface DeleteRepository extends Repository {
    delete: (query: Query, operation: Operation) => Promise<void>;
}
