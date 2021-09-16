import { Query } from '..';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DataSource {}

export interface GetDataSource<T> extends DataSource {
    get(query: Query): Promise<T>;
    getAll(query: Query): Promise<T[]>;
}

export interface PutDataSource<T> extends DataSource {
    put(value: T, query: Query): Promise<T>;
    putAll(values: T[], query: Query): Promise<T[]>;
}

export interface DeleteDataSource extends DataSource {
    delete(query: Query): Promise<void>;
    deleteAll(query: Query): Promise<void>;
}
