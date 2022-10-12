import { Mapper } from './mapper/mapper';
import { Operation } from './operation/operation';
import { Query } from './query/query';
import { DeleteRepository, GetRepository, PutRepository, Repository } from './repository';
import { DeviceConsoleLogger, Logger } from '../helpers';

/**
 * This repository uses mappers to map objects and redirects them to the contained repository, acting as a simple "translator".
 *
 * @param getRepository Repository with get operations
 * @param putRepository Repository with put operations
 * @param deleteRepository Repository with delete operations
 * @param toOutMapper Mapper to map data objects to domain objects
 * @param toInMapper Mapper to map domain objects to data objects
 */
export class RepositoryMapper<In, Out> implements Repository<Out> {
    private readonly getMapper: GetRepositoryMapper<In, Out>;
    private readonly putMapper: PutRepositoryMapper<In, Out>;

    constructor(
        getRepository: GetRepository<In>,
        putRepository: PutRepository<In>,
        private readonly deleteRepository: DeleteRepository,
        toOutMapper: Mapper<In, Out>,
        toInMapper: Mapper<Out, In>,
        private readonly logger: Logger = new DeviceConsoleLogger(),
    ) {
        this.getMapper = new GetRepositoryMapper(getRepository, toOutMapper);
        this.putMapper = new PutRepositoryMapper(putRepository, toOutMapper, toInMapper);
    }

    public get(query: Query, operation: Operation): Promise<Out> {
        return this.getMapper.get(query, operation);
    }

    public getAll(query: Query, operation: Operation): Promise<Out[]> {
        return this.getMapper.getAll(query, operation);
    }

    public put(value: Out | undefined, query: Query, operation: Operation): Promise<Out> {
        return this.putMapper.put(value, query, operation);
    }

    public async putAll(values: Out[] | undefined, query: Query, operation: Operation): Promise<Out[]> {
        return this.putMapper.putAll(values, query, operation);
    }

    public async delete(query: Query, operation: Operation): Promise<void> {
        return this.deleteRepository.delete(query, operation);
    }
}

/**
 * This repository uses mappers to map objects and redirects them to the contained repository, acting as a simple "translator".
 *
 * @param getRepository Repository with get operations
 * @param toOutMapper Mapper to map data objects to domain objects
 */
export class GetRepositoryMapper<In, Out> implements GetRepository<Out> {
    constructor(private getRepository: GetRepository<In>, private toOutMapper: Mapper<In, Out>) {}

    public async get(query: Query, operation: Operation): Promise<Out> {
        const result: In = await this.getRepository.get(query, operation);
        return this.toOutMapper.map(result);
    }

    public async getAll(query: Query, operation: Operation): Promise<Out[]> {
        const results: In[] = await this.getRepository.getAll(query, operation);
        return results.map((r: In) => this.toOutMapper.map(r));
    }
}

/**
 * This repository uses mappers to map objects and redirects them to the contained repository, acting as a simple "translator".
 *
 * @param putRepository Repository with put operations
 * @param toOutMapper Mapper to map data objects to domain objects
 * @param toInMapper Mapper to map domain objects to data objects
 */
export class PutRepositoryMapper<In, Out> implements PutRepository<Out> {
    constructor(
        private putRepository: PutRepository<In>,
        private toOutMapper: Mapper<In, Out>,
        private toInMapper: Mapper<Out, In>,
    ) {}

    public async put(value: Out | undefined, query: Query, operation: Operation): Promise<Out> {
        const mapped: In | undefined = value ? this.toInMapper.map(value) : undefined;
        const result: In = await this.putRepository.put(mapped, query, operation);
        return this.toOutMapper.map(result);
    }

    public async putAll(values: Out[] | undefined, query: Query, operation: Operation): Promise<Out[]> {
        const mapped: In[] | undefined = values ? values.map((v) => this.toInMapper.map(v)) : undefined;
        const results: In[] = await this.putRepository.putAll(mapped, query, operation);
        return results.map((r: In) => this.toOutMapper.map(r));
    }
}
