import {AllObjectsQuery, DeleteDataSource, GetDataSource, IdsQuery, KeyQuery, PutDataSource, Query, QueryNotSupportedError} from '..';
import {Logger} from 'helpers';

export class InMemoryDataSource<T> implements GetDataSource<T>, PutDataSource<T>, DeleteDataSource {
    private objects: any = {};
    private arrays: any = {};

    constructor(
        private readonly logger: Logger,
    ) {}

    public async get(query: Query): Promise<T> {
        if (query instanceof KeyQuery) {
            return this.objects[query.key];
        } else {
            throw new QueryNotSupportedError();
        }
    }

    public async getAll(query: Query): Promise<T[]> {
        if (query instanceof KeyQuery) {
            return this.arrays[query.key];
        } else if (query instanceof AllObjectsQuery) {
            let array: T[] = [];
            Object.entries(this.objects).forEach(([, value]) => {
                array.push(value as T);
            });
            Object.entries(this.arrays).forEach(([, values]) => {
                for (let value of values as T[]) {
                    array.push(value as T);
                }
            });
            return array;
        } else if (query instanceof IdsQuery) {
            let array: T[] = [];
            for (let key of query.ids) {
                array.push(this.objects[key]);
            }
            return array;
        } else {
            throw new QueryNotSupportedError();
        }
    }

    public async put(value: T, query: Query): Promise<T> {
        if (query instanceof KeyQuery) {
            this.objects[query.key] = value;
            return value;
        } else {
            throw new QueryNotSupportedError();
        }
    }

    public async putAll(values: T[], query: Query): Promise<T[]> {
        if (query instanceof KeyQuery) {
            this.arrays[query.key] = values;
            return values;
        } else if (query instanceof IdsQuery) {
            for (let i = 0; i < query.ids.length; ++i) {
                let key = query.ids[i];
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
            for (let key of query.ids) {
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

    public async deleteAll(query: Query): Promise<void> {
        // tslint:disable-next-line:max-line-length
        this.logger.warning('[DEPRECATION] `deleteAll` will be deprecated. Calling `delete` instead. Rewrite using `delete` with `AllObjectsQuery` to remove all entries or with any other `Query` to remove one or more entries.');
        return this.delete(query);
    }
}
