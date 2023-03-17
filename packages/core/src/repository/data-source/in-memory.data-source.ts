import {
    AllObjectsQuery,
    DataSource,
    IdsQuery,
    InvalidArgumentError,
    KeyQuery,
    NotFoundError,
    Query,
    QueryNotSupportedError,
} from '..';
import { DeviceConsoleLogger, Logger } from '../../helpers';

export class InMemoryDataSource<T> implements DataSource<T> {
    private objects: Map<string, T> = new Map();

    constructor(private readonly logger: Logger = new DeviceConsoleLogger(undefined, 'InMemoryDataSource')) {}

    public async get(query: Query): Promise<T> {
        if (query instanceof KeyQuery) {
            if (this.objects.has(query.key)) {
                // SAFETY `as T`: we've just checked that `key` exists, so it's not `undefined`
                return this.objects.get(query.key) as T;
            }

            throw new NotFoundError();
        } else {
            throw new QueryNotSupportedError();
        }
    }

    public async put(value: T | undefined, query: Query): Promise<T> {
        if (typeof value === 'undefined') {
            throw new InvalidArgumentError(`InMemoryDataSource: value can't be undefined`);
        }

        if (query instanceof KeyQuery) {
            if (!query.key) {
                this.logger.warn('key is empty');
            }
            this.objects.set(query.key, value);
            return value;
        } else {
            throw new QueryNotSupportedError();
        }
    }

    public async delete(query: Query): Promise<void> {
        if (query instanceof IdsQuery) {
            for (const key of query.keys) {
                this.objects.delete(key);
            }
        } else if (query instanceof KeyQuery) {
            this.objects.delete(query.key);
        } else if (query instanceof AllObjectsQuery) {
            this.objects.clear();
        } else {
            throw new QueryNotSupportedError();
        }
    }
}
