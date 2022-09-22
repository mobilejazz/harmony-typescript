import { DeleteDataSource, GetDataSource, PutDataSource } from './data-source';
import { MethodNotImplementedError, Query } from '..';
import { DeviceConsoleLogger, Logger } from '../../helpers';

export class VoidDataSource<T> implements GetDataSource<T>, PutDataSource<T>, DeleteDataSource {
    constructor(private readonly logger: Logger = new DeviceConsoleLogger()) {}

    public async get(_query: Query): Promise<T> {
        throw new MethodNotImplementedError('Called get on VoidDataSource');
    }

    /**
     * @deprecated please use get with an array type instead
     */
    public async getAll(_query: Query): Promise<T[]> {
        console.warn('getAll is deprecated. Please use get instead');
        throw new MethodNotImplementedError('Called getAll on VoidDataSource');
    }

    public async put(_value: T, _query: Query): Promise<T> {
        throw new MethodNotImplementedError('Called put on VoidDataSource');
    }

    /**
     * @deprecated please use put with an array type instead
     */
    public async putAll(_values: T[], _query: Query): Promise<T[]> {
        console.warn('putAll is deprecated. Please use put instead');
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
    public async put(_value: T, _query: Query): Promise<T> {
        throw new MethodNotImplementedError('Called put on VoidPutDataSource');
    }

    public async putAll(_values: T[], _query: Query): Promise<T[]> {
        throw new MethodNotImplementedError('Called putAll on VoidPutDataSource');
    }
}

export class VoidDeleteDataSource implements DeleteDataSource {
    constructor(private readonly logger: Logger = new DeviceConsoleLogger()) {}

    public async delete(_query: Query): Promise<void> {
        throw new MethodNotImplementedError('Called delete on VoidDeleteDataSource');
    }
}
