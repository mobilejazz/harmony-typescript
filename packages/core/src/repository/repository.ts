import { Operation } from './operation/operation';
import { Query } from './query/query';

export interface GetRepository<T> {
    get: (query: Query, operation: Operation) => Promise<T>;
    /**
     * @deprecated please use get with an array type instead
     */
    getAll: (query: Query, operation: Operation) => Promise<T[]>;
}

export interface PutRepository<T> {
    put: (value: T | undefined, query: Query, operation: Operation) => Promise<T>;
    /**
     * @deprecated please use put with an array type instead
     */
    putAll: (values: T[] | undefined, query: Query, operation: Operation) => Promise<T[]>;
}

export interface DeleteRepository {
    delete: (query: Query, operation: Operation) => Promise<void>;
}

export type Repository<T> = GetRepository<T> & PutRepository<T> & DeleteRepository;
