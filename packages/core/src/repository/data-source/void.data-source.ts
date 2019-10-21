import {DeleteDataSource, GetDataSource, PutDataSource} from './data-source';
import {MethodNotImplementedError, Query} from '..';

export class VoidDataSource<T> implements GetDataSource<T>, PutDataSource<T>, DeleteDataSource {
    get(query: Query): Promise<T>;
    get<K>(id: K): Promise<T>;
    get<K>(queryOrId: Query | K): Promise<T> {
        throw new MethodNotImplementedError();
    }

    getAll(query: Query): Promise<T[]>;
    getAll<K>(ids: K[]): Promise<T[]>;
    getAll<K>(queryOrId: Query | K): Promise<T[]> {
        throw new MethodNotImplementedError();
    }

    put(value: T, query: Query): Promise<T>;
    put<K>(value: T, id: K): Promise<T>;
    put<K>(value: T, queryOrId: Query | K): Promise<T> {
        throw new MethodNotImplementedError();
    }

    putAll(values: T[], query: Query): Promise<T[]>;
    putAll<K>(values: T[], ids: K[]): Promise<T[]>;
    putAll<K>(values: T[], queryOrIds: Query | K[]): Promise<T[]> {
        throw new MethodNotImplementedError();
    }

    delete(query: Query): Promise<void>;
    delete<K>(id: K): Promise<void>;
    delete<K>(queryOrId: Query | K): Promise<void> {
        throw new MethodNotImplementedError();
    }

    deleteAll(query: Query): Promise<void>;
    deleteAll<K>(ids: K[]): Promise<void>;
    deleteAll<K>(queryOrIds: Query | K[]): Promise<void> {
        throw new MethodNotImplementedError();
    }
}

export class VoidGetDataSource<T> implements GetDataSource<T> {
    get(query: Query): Promise<T>;
    get<K>(id: K): Promise<T>;
    get<K>(queryOrId: Query | K): Promise<T> {
        throw new MethodNotImplementedError();
    }

    getAll(query: Query): Promise<T[]>;
    getAll<K>(ids: K[]): Promise<T[]>;
    getAll<K>(queryOrId: Query | K): Promise<T[]> {
        throw new MethodNotImplementedError();
    }
}

export class VoidPutDataSource<T> implements PutDataSource<T> {
    put(value: T, query: Query): Promise<T>;
    put<K>(value: T, id: K): Promise<T>;
    put<K>(value: T, queryOrId: Query | K): Promise<T> {
        throw new MethodNotImplementedError();
    }

    putAll(values: T[], query: Query): Promise<T[]>;
    putAll<K>(values: T[], ids: K[]): Promise<T[]>;
    putAll<K>(values: T[], queryOrIds: Query | K[]): Promise<T[]> {
        throw new MethodNotImplementedError();
    }
}

export class VoidDeleteDataSource implements DeleteDataSource {
    delete(query: Query): Promise<void>;
    delete<K>(id: K): Promise<void>;
    delete<K>(queryOrId: Query | K): Promise<void> {
        throw new MethodNotImplementedError();
    }

    deleteAll(query: Query): Promise<void>;
    deleteAll<K>(ids: K[]): Promise<void>;
    deleteAll<K>(queryOrIds: Query | K[]): Promise<void> {
        throw new MethodNotImplementedError();
    }
}
