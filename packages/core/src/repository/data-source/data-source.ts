import { Query } from '..';

export interface GetDataSource<T> {
    get: (query: Query) => Promise<T>;
}

export interface PutDataSource<T> {
    put: (value: T | undefined, query: Query) => Promise<T>;
}

export interface DeleteDataSource {
    delete: (query: Query) => Promise<void>;
}

export type DataSource<T> = GetDataSource<T> & PutDataSource<T> & DeleteDataSource;
