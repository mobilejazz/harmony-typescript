import { Mapper } from './mapper/mapper';
import { Operation } from './operation/operation';
import { Query } from './query/query';
import { DeleteRepository, GetRepository, PutRepository } from './repository';
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
export class RepositoryMapper<In, Out> implements GetRepository<Out>, PutRepository<Out>, DeleteRepository {
    constructor(
        private readonly getRepository: GetRepository<In>,
        private readonly putRepository: PutRepository<In>,
        private readonly deleteRepository: DeleteRepository,
        private readonly toOutMapper: Mapper<In, Out>,
        private readonly toInMapper: Mapper<Out, In>,
        private readonly logger: Logger = new DeviceConsoleLogger(),
    ) {}

    public async get(query: Query, operation: Operation): Promise<Out> {
        const result: In = await this.getRepository.get(query, operation);
        return this.toOutMapper.map(result);
    }

    public async getAll(query: Query, operation: Operation): Promise<Out[]> {
        const results: In[] = await this.getRepository.getAll(query, operation);
        return results.map((r: In) => this.toOutMapper.map(r));
    }

    public async put(value: Out, query: Query, operation: Operation): Promise<Out> {
        const mapped: In = value ? this.toInMapper.map(value) : undefined;
        const result: In = await this.putRepository.put(mapped, query, operation);
        return this.toOutMapper.map(result);
    }

    public async putAll(values: Out[], query: Query, operation: Operation): Promise<Out[]> {
        const mapped: In[] = values ? values.map((v) => (v ? this.toInMapper.map(v) : undefined)) : undefined;
        const results: In[] = await this.putRepository.putAll(mapped, query, operation);
        return results.map((r: In) => this.toOutMapper.map(r));
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

    public async put(value: Out, query: Query, operation: Operation): Promise<Out> {
        const mapped: In = value ? this.toInMapper.map(value) : undefined;
        const result: In = await this.putRepository.put(mapped, query, operation);
        return this.toOutMapper.map(result);
    }

    public async putAll(values: Out[], query: Query, operation: Operation): Promise<Out[]> {
        const mapped: In[] = values ? values.map((v) => this.toInMapper.map(v)) : undefined;
        const results: In[] = await this.putRepository.putAll(mapped, query, operation);
        return results.map((r: In) => this.toOutMapper.map(r));
    }
}
