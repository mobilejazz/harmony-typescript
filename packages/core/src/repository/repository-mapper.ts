import { Mapper } from './mapper/mapper';
import { DefaultOperation, Operation } from './operation/operation';
import { Query, VoidQuery } from './query/query';
import { DeleteRepository, GetRepository, PutRepository } from './repository';

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
    ) {}

    public get(query: Query, operation: Operation): Promise<Out>;
    public get<K>(id: K, operation: Operation): Promise<Out>;
    public async get<K>(queryOrId: Query | K, operation: Operation): Promise<Out> {
        const result: In = await this.getRepository.get(queryOrId, operation);
        return this.toOutMapper.map(result);
    }

    public getAll(query: Query, operation: Operation): Promise<Out[]>;
    public getAll<K>(ids: K[], operation: Operation): Promise<Out[]>;
    public async getAll<K>(queryOrId: Query | K[], operation: Operation): Promise<Out[]> {
        const results: In[] = await this.getRepository.getAll(queryOrId, operation);
        return results.map((r: In) => this.toOutMapper.map(r));
    }

    public put(value: Out, query?: Query, operation?: Operation): Promise<Out>;
    public put<K>(value: Out, id?: K, operation?: Operation): Promise<Out>;
    public async put<K>(value: Out, queryOrId: Query | K = new VoidQuery(), operation: Operation = new DefaultOperation()): Promise<Out> {
        let mapped: In  = this.toInMapper.map(value);
        let result: In = await this.putRepository.put(mapped, queryOrId, operation);
        return this.toOutMapper.map(result);
    }

    public putAll(values: Out[], query?: Query, operation?: Operation): Promise<Out[]>;
    public putAll<K>(values: Out[], ids?: K[], operation?: Operation): Promise<Out[]>;
    public async putAll<K>(
        values: Out[], queryOrIds: Query | K[] = new VoidQuery(),
        operation: Operation = new DefaultOperation()): Promise<Out[]> {

        let mapped: In[]  = this.toInMapper.map(values);
        let results: In[] = await this.putRepository.putAll(mapped, queryOrIds, operation);
        return results.map((r: In) => this.toOutMapper.map(r));
    }

    public delete(query: Query, operation: Operation): Promise<void>;
    public delete<K>(id: K, operation: Operation): Promise<void>;
    public async delete<K>(queryOrId: Query | K, operation: Operation): Promise<void> {
        return this.deleteRepository.delete(queryOrId, operation);
    }

    public deleteAll(query: Query, operation: Operation): Promise<void>;
    public deleteAll<K>(ids: K[], operation: Operation): Promise<void>;
    public async deleteAll<K>(queryOrIds: Query | K[], operation: Operation): Promise<void> {
        return this.deleteRepository.deleteAll(queryOrIds, operation);
    }

}

/**
 * This repository uses mappers to map objects and redirects them to the contained repository, acting as a simple "translator".
 *
 * @param getRepository Repository with get operations
 * @param toOutMapper Mapper to map data objects to domain objects
 */
export class GetRepositoryMapper<In, Out> implements GetRepository<Out> {

    constructor(
        private getRepository: GetRepository<In>,
        private toOutMapper: Mapper<In, Out>,
    ) {}

    public get(query: Query, operation: Operation): Promise<Out>;
    public get<K>(id: K, operation: Operation): Promise<Out>;
    public async get<K>(queryOrId: Query | K, operation: Operation): Promise<Out> {
        const result: In = await this.getRepository.get(queryOrId, operation);
        return this.toOutMapper.map(result);
    }

    public getAll(query: Query, operation: Operation): Promise<Out[]>;
    public getAll<K>(ids: K[], operation: Operation): Promise<Out[]>;
    public async getAll<K>(queryOrId: Query | K[], operation: Operation): Promise<Out[]> {
        const results: In[] = await this.getRepository.getAll(queryOrId, operation);
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

    public put(value: Out, query?: Query, operation?: Operation): Promise<Out>;
    public put<K>(value: Out, id?: K, operation?: Operation): Promise<Out>;
    public async put<K>(value: Out, queryOrId: Query | K = new VoidQuery(), operation: Operation = new DefaultOperation()): Promise<Out> {
        let mapped: In  = this.toInMapper.map(value);
        let result: In = await this.putRepository.put(mapped, queryOrId, operation);
        return this.toOutMapper.map(result);
    }

    public putAll(values: Out[], query?: Query, operation?: Operation): Promise<Out[]>;
    public putAll<K>(values: Out[], ids?: K[], operation?: Operation): Promise<Out[]>;
    public async putAll<K>(
        values: Out[], queryOrIds: Query | K[] = new VoidQuery(),
        operation: Operation = new DefaultOperation()): Promise<Out[]> {

        let mapped: In[]  = this.toInMapper.map(values);
        let results: In[] = await this.putRepository.putAll(mapped, queryOrIds, operation);
        return results.map((r: In) => this.toOutMapper.map(r));
    }
}
