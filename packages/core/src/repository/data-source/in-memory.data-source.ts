import {AllObjectsQuery, DeleteDataSource, GetDataSource, IdsQuery, KeyQuery, PutDataSource, Query, QueryNotSupportedError} from '..';

export class InMemoryDataSource<T> implements GetDataSource<T>, PutDataSource<T>, DeleteDataSource {
    private objects: any = {};
    private arrays: any = {};

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
            delete this.objects[query.key];
            return;
        } else {
            throw new QueryNotSupportedError();
        }
    }

    public async deleteAll(query: Query): Promise<void> {
        if (query instanceof KeyQuery) {
            delete this.arrays[query.key];
            return;
        } else if (query instanceof IdsQuery) {
            for (let key of query.ids) {
                delete this.objects[key];
            }
            return;
        } else if (query instanceof AllObjectsQuery) {
            this.objects = {};
            this.arrays = {};
            return;
        } else {
            throw new QueryNotSupportedError();
        }
    }
}
