import { Query } from '..';

export interface DataSource {}

export interface GetDataSource<T> extends DataSource {
    get(query: Query): Promise<T>;
    get<K>(id: K): Promise<T>;

    getAll(query: Query): Promise<T[]>;
    getAll<K>(ids: K[]): Promise<T[]>;
}

export interface PutDataSource<T> extends DataSource {
    put(value: T, query: Query): Promise<T>;
    put<K>(value: T, id: K): Promise<T>;

    putAll(values: T[], query: Query): Promise<T[]>;
    putAll<K>(values: T[], ids: K[]): Promise<T[]>;
}

export interface DeleteDataSource extends DataSource {
    delete(query: Query): Promise<void>;
    delete<K>(id: K): Promise<void>;

    deleteAll(query: Query): Promise<void>;
    deleteAll<K>(ids: K[]): Promise<void>;
}
