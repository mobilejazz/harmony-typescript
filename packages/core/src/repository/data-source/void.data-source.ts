import { DataSource, DeleteDataSource, GetDataSource, PutDataSource } from './data-source';
import { MethodNotImplementedError, Query } from '..';
import { DeviceConsoleLogger, Logger } from '../../helpers';

export class VoidDataSource<T> implements DataSource<T> {
    constructor(private readonly logger: Logger = new DeviceConsoleLogger()) {}

    public async get(_query: Query): Promise<T> {
        throw new MethodNotImplementedError('Called get on VoidDataSource');
    }

    public async getAll(_query: Query): Promise<T[]> {
        throw new MethodNotImplementedError('Called getAll on VoidDataSource');
    }

    public async put(_value: T | undefined, _query: Query): Promise<T> {
        throw new MethodNotImplementedError('Called put on VoidDataSource');
    }

    public async putAll(_values: T[] | undefined, _query: Query): Promise<T[]> {
        throw new MethodNotImplementedError('Called putAll on VoidDataSource');
    }

    public async delete(_query: Query): Promise<void> {
        throw new MethodNotImplementedError('Called delete on VoidDataSource');
    }
}

export class VoidGetDataSource<T> implements GetDataSource<T> {
    public async get(_query: Query): Promise<T> {
        throw new MethodNotImplementedError('Called get on VoidGetDataSource');
    }

    public async getAll(_query: Query): Promise<T[]> {
        throw new MethodNotImplementedError('Called getAll on VoidGetDataSource');
    }
}

export class VoidPutDataSource<T> implements PutDataSource<T> {
    public async put(_value: T | undefined, _query: Query): Promise<T> {
        throw new MethodNotImplementedError('Called put on VoidPutDataSource');
    }

    public async putAll(_values: T[] | undefined, _query: Query): Promise<T[]> {
        throw new MethodNotImplementedError('Called putAll on VoidPutDataSource');
    }
}

export class VoidDeleteDataSource implements DeleteDataSource {
    constructor(private readonly logger: Logger = new DeviceConsoleLogger()) {}

    public async delete(_query: Query): Promise<void> {
        throw new MethodNotImplementedError('Called delete on VoidDeleteDataSource');
    }
}
