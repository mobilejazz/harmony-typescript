import {DeleteDataSource, GetDataSource, PutDataSource} from './data-source';
import {MethodNotImplementedError, Query} from '..';

export class VoidDataSource<T> implements GetDataSource<T>, PutDataSource<T>, DeleteDataSource {
    public async get(query: Query): Promise<T> {
        throw new MethodNotImplementedError('Called get on VoidDataSource');
    }

    public async getAll(query: Query): Promise<T[]> {
        throw new MethodNotImplementedError('Called getAll on VoidDataSource');
    }

    public async put(value: T, query: Query): Promise<T> {
        throw new MethodNotImplementedError('Called put on VoidDataSource');
    }

    public async putAll(values: T[], query: Query): Promise<T[]> {
        throw new MethodNotImplementedError('Called putAll on VoidDataSource');
    }

    public async delete(query: Query): Promise<void> {
        throw new MethodNotImplementedError('Called delete on VoidDataSource');
    }

    public async deleteAll(query: Query): Promise<void> {
        console.warn('[DEPRECATION] `deleteAll` will be deprecated.');
        throw new MethodNotImplementedError('Called deleteAll on VoidDataSource');
    }
}

export class VoidGetDataSource<T> implements GetDataSource<T> {
    public async get(query: Query): Promise<T> {
        throw new MethodNotImplementedError('Called get on VoidGetDataSource');
    }

    public async getAll(query: Query): Promise<T[]> {
        throw new MethodNotImplementedError('Called getAll on VoidGetDataSource');
    }
}

export class VoidPutDataSource<T> implements PutDataSource<T> {
    public async put(value: T, query: Query): Promise<T> {
        throw new MethodNotImplementedError('Called put on VoidPutDataSource');
    }

    public async putAll(values: T[], query: Query): Promise<T[]> {
        throw new MethodNotImplementedError('Called putAll on VoidPutDataSource');
    }
}

export class VoidDeleteDataSource implements DeleteDataSource {
    public async delete(query: Query): Promise<void> {
        throw new MethodNotImplementedError('Called delete on VoidDeleteDataSource');
    }

    public async deleteAll(query: Query): Promise<void> {
        console.warn('[DEPRECATION] `deleteAll` will be deprecated.');
        throw new MethodNotImplementedError('Called deleteAll on VoidDeleteDataSource');
    }
}
