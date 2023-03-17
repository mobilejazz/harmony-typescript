import { DataSource } from './data-source';
import { Query } from '..';

export class MockDataSource<T> implements DataSource<T> {
    constructor(private readonly one: T) {}

    public async get(_query: Query): Promise<T> {
        return this.one;
    }

    public async put(_value: T | undefined, _query: Query): Promise<T> {
        return this.one;
    }

    public async delete(_query: Query): Promise<void> {
        return;
    }
}
