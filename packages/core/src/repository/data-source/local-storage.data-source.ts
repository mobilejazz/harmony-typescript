import { KeyQuery, Query, QueryNotSupportedError } from '..';
import { DeleteDataSource, GetDataSource, PutDataSource } from './data-source';

export class LocalStorageDataSource  implements GetDataSource<string>, PutDataSource<string>, DeleteDataSource {
    get(query: Query): Promise<string>;
    get<K>(id: K): Promise<string>;
    public async get<K extends string>(queryOrId: Query | K): Promise<string> {
        if (queryOrId instanceof Query) {
            if (queryOrId instanceof KeyQuery) {
                return localStorage.getItem(queryOrId.key) as string;
            } else {
                throw new QueryNotSupportedError();
            }
        } else {
            return localStorage.getItem(queryOrId) as string;
        }
    }

    getAll(query: Query): Promise<string[]>;
    getAll<K>(ids: K[]): Promise<string[]>;
    public async getAll<K extends string>(queryOrIds: Query | K[]): Promise<string[]> {

        if (queryOrIds instanceof Query) {
            if (queryOrIds instanceof KeyQuery) {
                let keys = queryOrIds.key.split(',');
                return keys.map((key: string) => localStorage.getItem(key) as string);
            } else {
                throw QueryNotSupportedError;
            }
        } else {
            return queryOrIds.map((key: string) => localStorage.getItem(key) as string);
        }
    }

    put(value: string, query: Query): Promise<string>;
    put<K>(value: string, id: K): Promise<string>;
    public async put<K extends string>(value: string, queryOrId: Query | K): Promise<string> {
        if (queryOrId instanceof Query) {
            if (queryOrId instanceof KeyQuery) {
                localStorage.setItem(queryOrId.key, value);
                return localStorage.getItem(queryOrId.key) as string;
            } else {
                throw QueryNotSupportedError;
            }
        } else {
            localStorage.setItem(queryOrId, value);
            return localStorage.getItem(queryOrId) as string;
        }

    }

    putAll(values: string[], query: Query): Promise<string[]>;
    putAll<K>(values: string[], ids: K[]): Promise<string[]>;
    public async putAll<K extends string>(values: string[], queryOrIds: Query | K[]): Promise<string[]> {
        if (queryOrIds instanceof Query) {
            if (queryOrIds instanceof KeyQuery) {
                let keys = queryOrIds.key.split(',');
                return keys.map((key, index) => {
                    localStorage.setItem(key, values[index]);
                    return localStorage.getItem(key) as string;
                });
            } else {
                throw QueryNotSupportedError;
            }
        } else {
            return queryOrIds.map((key, index) => {
                localStorage.setItem(key, values[index]);
                return localStorage.getItem(key) as string;
            });
        }
    }

    delete(query: Query): Promise<boolean>;
    delete<K>(id: K): Promise<boolean>;
    public async delete<K extends string>(queryOrId: Query | K): Promise<boolean> {
        if (queryOrId instanceof Query) {
            if (queryOrId instanceof KeyQuery) {
                localStorage.removeItem(queryOrId.key);
                return localStorage.getItem(queryOrId.key) === null;
            } else {
                throw QueryNotSupportedError;
            }
        } else {
            localStorage.removeItem(queryOrId);
            return localStorage.getItem(queryOrId) === null;
        }
    }

    deleteAll(query: Query): Promise<boolean>;
    deleteAll<K>(ids: K[]): Promise<boolean>;
    public async deleteAll<K extends string>(queryOrIds: Query | K[]): Promise<boolean> {
        if (queryOrIds instanceof Query) {
            if (queryOrIds instanceof KeyQuery) {
                let keys = queryOrIds.key.split(',');
                let result = keys.map((key: string) => {
                    localStorage.removeItem(key);
                    return localStorage.getItem(key) === null;
                });
                return result.indexOf(false) === -1;
            } else {
                throw QueryNotSupportedError;
            }
        } else {
            let result = queryOrIds.map((key: string) => {
                localStorage.removeItem(key);
                return localStorage.getItem(key) === null;
            });
            return result.indexOf(false) === -1;
        }
    }
}
