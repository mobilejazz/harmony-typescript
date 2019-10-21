import {DeleteDataSource, GetDataSource, PutDataSource} from './data-source';
import {Query} from '..';

export class MockDataSource<T> implements  GetDataSource<T>, PutDataSource<T>, DeleteDataSource {

    constructor(
        private readonly one: T,
        private readonly many: T[],
    ) {}

    get(query: Query): Promise<T>;
    get<K>(id: K): Promise<T>;
    get<K>(queryOrId: Query | K): Promise<T> {
        return Promise.resolve(this.one);
    }

    getAll(query: Query): Promise<T[]>;
    getAll<K>(ids: K[]): Promise<T[]>;
    getAll<K>(queryOrIds: Query | K[]): Promise<T[]> {
        return Promise.resolve(this.many);
    }

    put(value: T, query: Query): Promise<T>;
    put<K>(value: T, id: K): Promise<T>;
    put<K>(value: T, queryOrId: Query | K): Promise<T> {
        return Promise.resolve(this.one);
    }

    putAll(values: T[], query: Query): Promise<T[]>;
    putAll<K>(values: T[], ids: K[]): Promise<T[]>;
    putAll<K>(values: T[], queryOrIds: Query | K): Promise<T[]> {
        return Promise.resolve(this.many);
    }

    delete(query: Query): Promise<void>;
    delete<K>(id: K): Promise<void>;
    delete<K>(queryOrId: Query | K): Promise<void> {
        return Promise.resolve();
    }

    deleteAll(query: Query): Promise<void>;
    deleteAll<K>(ids: K[]): Promise<void>;
    deleteAll<K>(queryOrIds: Query | K[]): Promise<void> {
        return Promise.resolve();
    }
}
