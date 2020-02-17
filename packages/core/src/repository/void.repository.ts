import { MethodNotImplementedError } from './errors';
import { Operation } from './operation/operation';
import { Query } from './query/query';
import { DeleteRepository, GetRepository, PutRepository } from './repository';
import {DeviceConsoleLogger, Logger} from '../helpers';

export class VoidRepository<T> implements GetRepository<T>, PutRepository<T>, DeleteRepository {
    constructor(
        private readonly logger: Logger = new DeviceConsoleLogger(),
    ) {}

    public async get(query: Query, operation: Operation): Promise<T> {
        throw new MethodNotImplementedError('Called get on VoidRepository');
    }
    public async getAll(query: Query, operation: Operation): Promise<T[]> {
        throw new MethodNotImplementedError('Called getAll on VoidRepository');
    }
    public async put(value: T, query?: Query, operation?: Operation): Promise<T> {
        throw new MethodNotImplementedError('Called put on VoidRepository');
    }
    public async putAll(values: T[], query?: Query, operation?: Operation): Promise<T[]> {
        throw new MethodNotImplementedError('Called putAll on VoidRepository');
    }
    public async delete(query: Query, operation: Operation): Promise<void> {
        throw new MethodNotImplementedError('Called delete on VoidRepository');
    }
    public async deleteAll(query: Query, operation: Operation): Promise<void> {
        this.logger.warning('[DEPRECATION] `deleteAll` will be deprecated. Use `delete` instead.');
        throw new MethodNotImplementedError('Called deleteAll on VoidRepository');
    }
}

export class VoidGetRepository<T> implements GetRepository<T> {
    public async get(query: Query, operation: Operation): Promise<T> {
        throw new MethodNotImplementedError('Called get on VoidGetRepository');
    }
    public async getAll(query: Query, operation: Operation): Promise<T[]> {
        throw new MethodNotImplementedError('Called getAll on VoidGetRepository');
    }
}

export class VoidPutRepository<T> implements PutRepository<T> {
    public async put(value: T, query?: Query, operation?: Operation): Promise<T> {
        throw new MethodNotImplementedError('Called put on VoidPutRepository');
    }
    public async putAll(values: T[], query?: Query, operation?: Operation): Promise<T[]> {
        throw new MethodNotImplementedError('Called putAll on VoidPutRepository');
    }
}

export class VoidDeleteRepository implements DeleteRepository {
    constructor(
        private readonly logger: Logger = new DeviceConsoleLogger(),
    ) {}

    public async delete(query: Query, operation: Operation): Promise<void> {
        throw new MethodNotImplementedError('Called delete on VoidDeleteRepository');
    }

    public async deleteAll(query: Query, operation: Operation): Promise<void> {
        this.logger.warning('[DEPRECATION] `deleteAll` will be deprecated. Use `delete` instead.');
        throw new MethodNotImplementedError('Called deleteAll on VoidDeleteRepository');
    }
}
