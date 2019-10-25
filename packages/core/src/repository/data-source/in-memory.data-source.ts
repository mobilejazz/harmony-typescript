
import {
    AllObjectsQuery,
    GetDataSource,
    PutDataSource,
    DeleteDataSource,
    Query, IdsQuery,
    KeyQuery,
    QueryNotSupportedError,
} from '..';

export class InMemoryDataSource<T> implements GetDataSource<T>, PutDataSource<T>, DeleteDataSource {
    private objects: any = {};
    private arrays: any = {};

    get(query: Query): Promise<T>;
    get<K>(id: K): Promise<T>;
    get<K>(queryOrId: Query | K): Promise<T> {
        if (queryOrId instanceof Query) {
            if (queryOrId instanceof KeyQuery) {
                return Promise.resolve(this.objects[queryOrId.key]);
            } else {
                return Promise.reject(new QueryNotSupportedError());
            }
        } else {
            return Promise.resolve(this.objects[queryOrId]);
        }
    }

    getAll(query: Query): Promise<T[]>;
    getAll<K>(ids: K[]): Promise<T[]>;
    getAll<K>(queryOrIds: Query | K[]): Promise<T[]> {
        if (queryOrIds instanceof Query) {
            if (queryOrIds instanceof KeyQuery) {
                return Promise.resolve(this.arrays[queryOrIds.key]);
            } else if (queryOrIds instanceof AllObjectsQuery) {
                let array: T[] = [];
                Object.entries(this.objects).forEach(([key, value]) => {
                    array.push(value as T);
                });
                Object.entries(this.arrays).forEach(([key, values]) => {
                    for (let value of values as T[]) {
                        array.push(value as T);
                    }
                });
                return Promise.resolve(array);
            } else if (queryOrIds instanceof IdsQuery) {
                let array: T[] = [];
                for (let key of queryOrIds.ids) {
                    array.push(this.objects[key]);
                }
                return Promise.resolve(array);
            } else {
                return Promise.reject(new QueryNotSupportedError());
            }
        } else {
            let array: T[] = [];
            for (let key of queryOrIds as K[]) {
                array.push(this.objects[key]);
            }
            return Promise.resolve(array);
        }
    }

    put(value: T, query: Query): Promise<T>;
    put<K>(value: T, id: K): Promise<T>;
    put<K>(value: T, queryOrId: Query | K): Promise<T> {
        if (queryOrId instanceof Query) {
            if (queryOrId instanceof KeyQuery) {
                this.objects[queryOrId.key] = value;
                return Promise.resolve(value);
            } else {
                return Promise.reject(new QueryNotSupportedError());
            }
        } else {
            this.objects[queryOrId] = value;
            return Promise.resolve(value);
        }
    }

    putAll(values: T[], query: Query): Promise<T[]>;
    putAll<K>(values: T[], ids: K[]): Promise<T[]>;
    putAll<K>(values: T[], queryOrIds: Query | K[]): Promise<T[]> {
        if (queryOrIds instanceof Query) {
            if (queryOrIds instanceof KeyQuery) {
                this.arrays[queryOrIds.key] = values;
                return Promise.resolve(values);
            } else if (queryOrIds instanceof IdsQuery) {
                for (let i = 0; i < queryOrIds.ids.length; ++i) {
                    let key = queryOrIds.ids[i];
                    let value = values[i];
                    this.objects[key] = value;
                }
                return Promise.resolve(values);
            } else {
                return Promise.reject(new QueryNotSupportedError());
            }
        } else {
            for (let i = 0; i < (queryOrIds as K[]).length; ++i) {
                let key = queryOrIds[i];
                let value = values[i];
                this.objects[key] = value;
            }
            return Promise.resolve(values);
        }
    }

    delete(query: Query): Promise<void>;
    delete<K>(id: K): Promise<void>;
    delete<K>(queryOrId: Query | K): Promise<void> {
        if (queryOrId instanceof Query) {
            if (queryOrId instanceof KeyQuery) {
                delete this.objects[queryOrId.key];
                return Promise.resolve();
            } else {
                return Promise.reject(new QueryNotSupportedError());
            }
        } else {
            delete this.objects[queryOrId as K];
            return Promise.resolve();
        }
    }

    deleteAll(query: Query): Promise<void>;
    deleteAll<K>(ids: K[]): Promise<void>;
    deleteAll<K>(queryOrIds: Query | K[]): Promise<void> {
        if (queryOrIds instanceof Query) {
            if (queryOrIds instanceof KeyQuery) {
                delete this.arrays[queryOrIds.key];
                return Promise.resolve();
            } else if (queryOrIds instanceof IdsQuery) {
                for (let key of queryOrIds.ids) {
                    delete this.objects[key];
                }
                return Promise.resolve();
            } else if (queryOrIds instanceof AllObjectsQuery) {
                this.objects = {};
                this.arrays = {};
                return Promise.resolve();
            } else {
                return Promise.reject(new QueryNotSupportedError());
            }
        } else {
            for (let key of queryOrIds as K[]) {
                delete this.objects[key];
            }
            return Promise.resolve();
        }
    }
}
