import {DeleteDataSource, GetDataSource, PutDataSource} from './data-source';
import {Query} from '..';

export class MockDataSource<T> implements  GetDataSource<T>, PutDataSource<T>, DeleteDataSource {
    constructor(
        private readonly one: T,
        private readonly many: T[],
    ) {}

    public async get(query: Query): Promise<T> {
        return this.one;
    }

    public async getAll(query: Query): Promise<T[]> {
        return this.many;
    }

    public async put(value: T, query: Query): Promise<T> {
        return this.one;
    }

    public async putAll(values: T[], query: Query): Promise<T[]> {
        return this.many;
    }

    public async delete(query: Query): Promise<void> {
        return;
    }

    public async deleteAll(query: Query): Promise<void> {
        console.warn('[DEPRECATION] `deleteAll` will be deprecated. Use `delete` instead.');
    }
}
