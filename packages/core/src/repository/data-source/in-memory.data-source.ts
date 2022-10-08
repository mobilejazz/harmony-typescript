import {
    AllObjectsQuery,
    DeleteDataSource,
    GetDataSource,
    IdsQuery,
    InvalidArgumentError,
    KeyQuery,
    PutDataSource,
    Query,
    QueryNotSupportedError,
} from '..';
import { DeviceConsoleLogger, Logger } from '../../helpers';

export class InMemoryDataSource<T> implements GetDataSource<T>, PutDataSource<T>, DeleteDataSource {
    private objects: Record<string, T> = {};
    private arrays: Record<string, T[]> = {};

    constructor(private readonly logger: Logger = new DeviceConsoleLogger()) {}

    public async get(query: Query): Promise<T> {
        if (query instanceof KeyQuery) {
            return this.objects[query.key];
        } else {
            throw new QueryNotSupportedError();
        }
    }

    /**
     * @deprecated please use get with an array type instead
     */
    public async getAll(query: Query): Promise<T[]> {
        console.warn('getAll is deprecated. Please use get instead');
        if (query instanceof KeyQuery) {
            return this.arrays[query.key];
        } else if (query instanceof AllObjectsQuery) {
            const array: T[] = [];
            Object.entries(this.objects).forEach(([, value]) => {
                array.push(value as T);
            });
            Object.entries(this.arrays).forEach(([, values]) => {
                for (const value of values as T[]) {
                    array.push(value as T);
                }
            });
            return array;
        } else if (query instanceof IdsQuery) {
            const array: T[] = [];
            for (const key of query.ids) {
                array.push(this.objects[key]);
            }
            return array;
        } else {
            throw new QueryNotSupportedError();
        }
    }

    public async put(value: T | undefined, query: Query): Promise<T> {
        if (typeof value === 'undefined') {
            throw new InvalidArgumentError(`InMemoryDataSource: value can't be undefined`);
        }

        if (query instanceof KeyQuery) {
            this.objects[query.key] = value;
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

        if (query instanceof KeyQuery) {
            this.arrays[query.key] = values;
            return values;
        } else if (query instanceof IdsQuery) {
            for (let i = 0; i < query.ids.length; ++i) {
                const key = query.ids[i];
                this.objects[key] = values[i];
            }
            return values;
        } else {
            throw new QueryNotSupportedError();
        }
    }

    public async delete(query: Query): Promise<void> {
        if (query instanceof KeyQuery) {
            delete this.arrays[query.key];
            delete this.objects[query.key];
        } else if (query instanceof IdsQuery) {
            for (const key of query.ids) {
                delete this.arrays[key];
                delete this.objects[key];
            }
        } else if (query instanceof AllObjectsQuery) {
            this.arrays = {};
            this.objects = {};
        } else {
            throw new QueryNotSupportedError();
        }
    }
}
