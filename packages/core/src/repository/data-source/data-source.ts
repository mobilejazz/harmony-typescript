import { Query } from '..';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DataSource {}

export interface GetDataSource<T> extends DataSource {
    get: (query: Query) => Promise<T>;
    /**
     * @deprecated please use get with an array type instead
     */
    getAll: (query: Query) => Promise<T[]>;
}

export interface PutDataSource<T> extends DataSource {
    put: (value: T | undefined, query: Query) => Promise<T>;
    /**
     * @deprecated please use put with an array type instead
     */
    putAll: (values: T[] | undefined, query: Query) => Promise<T[]>;
}

export interface DeleteDataSource extends DataSource {
    delete: (query: Query) => Promise<void>;
}
