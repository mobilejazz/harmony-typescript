import { MethodNotImplementedError } from './errors';
import { Operation } from './operation/operation';
import { Query } from './query/query';
import { DeleteRepository, GetRepository, PutRepository } from './repository';
import { DeviceConsoleLogger, Logger } from '../helpers';

export class VoidRepository<T> implements GetRepository<T>, PutRepository<T>, DeleteRepository {
    constructor(private readonly logger: Logger = new DeviceConsoleLogger()) {}

    public async get(_query: Query, _operation: Operation): Promise<T> {
        throw new MethodNotImplementedError('Called get on VoidRepository');
    }
    /**
     * @deprecated please use get with an array type instead
     */
    public async getAll(_query: Query, _operation: Operation): Promise<T[]> {
        console.warn('getAll is deprecated. Please use get instead');
        throw new MethodNotImplementedError('Called getAll on VoidRepository');
    }
    public async put(_value: T | undefined, _query?: Query, _operation?: Operation): Promise<T> {
        throw new MethodNotImplementedError('Called put on VoidRepository');
    }
    /**
     * @deprecated please use put with an array type instead
     */
    public async putAll(_values: T[] | undefined, _query?: Query, _operation?: Operation): Promise<T[]> {
        console.warn('putAll is deprecated. Please use put instead');
        throw new MethodNotImplementedError('Called putAll on VoidRepository');
    }
    public async delete(_query: Query, _operation: Operation): Promise<void> {
        throw new MethodNotImplementedError('Called delete on VoidRepository');
    }
}

export class VoidGetRepository<T> implements GetRepository<T> {
    public async get(_query: Query, _operation: Operation): Promise<T> {
        throw new MethodNotImplementedError('Called get on VoidGetRepository');
    }

    /**
     * @deprecated please use get with an array type instead
     */
    public async getAll(_query: Query, _operation: Operation): Promise<T[]> {
        console.warn('getAll is deprecated. Please use get instead');
        throw new MethodNotImplementedError('Called getAll on VoidGetRepository');
    }
}

export class VoidPutRepository<T> implements PutRepository<T> {
    public async put(_value: T | undefined, _query?: Query, _operation?: Operation): Promise<T> {
        throw new MethodNotImplementedError('Called put on VoidPutRepository');
    }
    /**
     * @deprecated please use put with an array type instead
     */
    public async putAll(_values: T[] | undefined, _query?: Query, _operation?: Operation): Promise<T[]> {
        console.warn('putAll is deprecated. Please use put instead');
        throw new MethodNotImplementedError('Called putAll on VoidPutRepository');
    }
}

export class VoidDeleteRepository implements DeleteRepository {
    constructor(private readonly logger: Logger = new DeviceConsoleLogger()) {}

    public async delete(_query: Query, _operation: Operation): Promise<void> {
        throw new MethodNotImplementedError('Called delete on VoidDeleteRepository');
    }
}
