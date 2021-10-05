import { DeleteDataSource, GetDataSource, PutDataSource } from './data-source';
import { Query } from '..';
import { DeviceConsoleLogger, Logger } from '../../helpers';

export class MockDataSource<T> implements GetDataSource<T>, PutDataSource<T>, DeleteDataSource {
    constructor(
        private readonly one: T,
        private readonly many: T[],
        private readonly logger: Logger = new DeviceConsoleLogger(),
    ) {}

    public async get(_query: Query): Promise<T> {
        return this.one;
    }

    public async getAll(_query: Query): Promise<T[]> {
        return this.many;
    }

    public async put(_value: T, _query: Query): Promise<T> {
        return this.one;
    }

    public async putAll(_values: T[], _query: Query): Promise<T[]> {
        return this.many;
    }

    public async delete(_query: Query): Promise<void> {
        return;
    }
}
