import { DataSource, DeleteDataSource, GetDataSource, PutDataSource } from './data-source';
import { MethodNotImplementedError, Query } from '..';

export class VoidDataSource<T> implements DataSource<T> {
    public async get(_query: Query): Promise<T> {
        throw new MethodNotImplementedError('Called get on VoidDataSource');
    }

    public async put(_value: T | undefined, _query: Query): Promise<T> {
        throw new MethodNotImplementedError('Called put on VoidDataSource');
    }

    public async delete(_query: Query): Promise<void> {
        throw new MethodNotImplementedError('Called delete on VoidDataSource');
    }
}

export class VoidGetDataSource<T> implements GetDataSource<T> {
    public async get(_query: Query): Promise<T> {
        throw new MethodNotImplementedError('Called get on VoidGetDataSource');
    }
}

export class VoidPutDataSource<T> implements PutDataSource<T> {
    public async put(_value: T | undefined, _query: Query): Promise<T> {
        throw new MethodNotImplementedError('Called put on VoidPutDataSource');
    }
}

export class VoidDeleteDataSource implements DeleteDataSource {
    public async delete(_query: Query): Promise<void> {
        throw new MethodNotImplementedError('Called delete on VoidDeleteDataSource');
    }
}
