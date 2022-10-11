import { MethodNotImplementedError } from './errors';
import { Operation } from './operation/operation';
import { Query } from './query/query';
import { DeleteRepository, GetRepository, PutRepository, Repository } from './repository';
import { DeviceConsoleLogger, Logger } from '../helpers';

export class VoidRepository<T> implements Repository<T> {
    constructor(private readonly logger: Logger = new DeviceConsoleLogger()) {}

    public async get(_query: Query, _operation: Operation): Promise<T> {
        throw new MethodNotImplementedError('Called get on VoidRepository');
    }
    public async getAll(_query: Query, _operation: Operation): Promise<T[]> {
        throw new MethodNotImplementedError('Called getAll on VoidRepository');
    }
    public async put(_value: T | undefined, _query?: Query, _operation?: Operation): Promise<T> {
        throw new MethodNotImplementedError('Called put on VoidRepository');
    }
    public async putAll(_values: T[] | undefined, _query?: Query, _operation?: Operation): Promise<T[]> {
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
    public async getAll(_query: Query, _operation: Operation): Promise<T[]> {
        throw new MethodNotImplementedError('Called getAll on VoidGetRepository');
    }
}

export class VoidPutRepository<T> implements PutRepository<T> {
    public async put(_value: T | undefined, _query?: Query, _operation?: Operation): Promise<T> {
        throw new MethodNotImplementedError('Called put on VoidPutRepository');
    }
    public async putAll(_values: T[] | undefined, _query?: Query, _operation?: Operation): Promise<T[]> {
        throw new MethodNotImplementedError('Called putAll on VoidPutRepository');
    }
}

export class VoidDeleteRepository implements DeleteRepository {
    constructor(private readonly logger: Logger = new DeviceConsoleLogger()) {}

    public async delete(_query: Query, _operation: Operation): Promise<void> {
        throw new MethodNotImplementedError('Called delete on VoidDeleteRepository');
    }
}
