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
    private arrays: Map<string, T[]> = new Map();

    constructor(
        private readonly logger: Logger = new DeviceConsoleLogger(undefined, 'InMemoryDataSource')
    ) {}

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

    /**
     * @deprecated please use get with an array type instead
     */
    public async getAll(query: Query): Promise<T[]> {
        console.warn('getAll is deprecated. Please use get instead');

        if (query instanceof IdsQuery) {
            return query.keys.map((key) => {
                if (!this.objects.has(key)) {
                    throw new NotFoundError();
                }

                // SAFETY `as T`: `undefined` case handled above
                return this.objects.get(key) as T;
            });
        } else if (query instanceof KeyQuery) {
            if (!this.arrays.has(query.key)) {
                throw new NotFoundError();
            }

            // SAFETY `as T[]`: `undefined` case handled above
            return this.arrays.get(query.key) as T[];
        } else if (query instanceof AllObjectsQuery) {
            return [
                ...Array.from(this.objects.values()),
                ...Array.from(this.arrays.values()).flatMap((values) => values),
            ];
        }

        throw new QueryNotSupportedError();
    }

    public async put(value: T | undefined, query: Query): Promise<T> {
        if (typeof value === 'undefined') {
            throw new InvalidArgumentError(`InMemoryDataSource: value can't be undefined`);
        }

        if (query instanceof KeyQuery) {
            if (!query.key) {
                this.logger.warn('InMemoryDataSource: key is empty');
            }
            this.objects.set(query.key, value);
            return value;
        } else {
            throw new QueryNotSupportedError();
        }
    }

    /**
     * @deprecated please use put with an array type instead
     */
    public async putAll(values: T[] | undefined, query: Query): Promise<T[]> {
        console.warn('putAll is deprecated. Please use put instead');

        if (typeof values === 'undefined') {
            throw new InvalidArgumentError(`InMemoryDataSource: values can't be undefined`);
        }

        if (query instanceof IdsQuery) {
            if (values.length !== query.keys.length) {
                throw new InvalidArgumentError(`InMemoryDataSource: values & query.keys have different length`);
            }

            query.keys.forEach((key, idx) => {
                this.objects.set(key, values[idx]);
            });

            return values;
        } else if (query instanceof KeyQuery) {
            this.arrays.set(query.key, values);
            return values;
        } else {
            throw new QueryNotSupportedError();
        }
    }

    public async delete(query: Query): Promise<void> {
        if (query instanceof IdsQuery) {
            for (const key of query.keys) {
                this.arrays.delete(key);
                this.objects.delete(key);
            }
        } else if (query instanceof KeyQuery) {
            this.arrays.delete(query.key);
            this.objects.delete(query.key);
        } else if (query instanceof AllObjectsQuery) {
            this.arrays.clear();
            this.objects.clear();
        } else {
            throw new QueryNotSupportedError();
        }
    }
}
