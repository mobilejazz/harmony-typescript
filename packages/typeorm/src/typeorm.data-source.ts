import {
    DeleteDataSource,
    ObjectQuery,
    ObjectRelationsQuery,
    GetDataSource,
    IdQuery,
    IdsQuery,
    PutDataSource,
    Query,
    QueryNotSupportedError,
    VoidQuery,
} from '@mobilejazz/harmony-core';
import { DeleteError } from '@mobilejazz/harmony-core';
import { Repository as TypeORMRepository } from 'typeorm';

export class TypeOrmDataSource<T> implements GetDataSource<T>, PutDataSource<T>, DeleteDataSource {

    constructor(private readonly repository: TypeORMRepository<T>) {

    }

    get(query: Query): Promise<T>;
    get<K>(id: K): Promise<T>;
    public async get<K>(queryOrId: Query | K): Promise<T | undefined> {
        if (queryOrId instanceof Query) {
            if (queryOrId instanceof IdQuery) {
                return this.repository.findOne(queryOrId.id);
            } else if (queryOrId instanceof ObjectRelationsQuery) {
                return this.repository.findOne({
                    where: queryOrId.value,
                    relations: queryOrId.relations,
                });
            } else if (queryOrId instanceof ObjectQuery) {
                return this.repository.findOne({where: queryOrId.value});
            } else {
                throw new QueryNotSupportedError();
            }
        } else {
            return this.repository.findOne(queryOrId);
        }
    }

    getAll(query: Query): Promise<T[]>;
    getAll<K>(ids: K[]): Promise<T[]>;
    public async getAll<K>(queryOrIds: Query | K[]): Promise<T[]> {
        if (queryOrIds instanceof Query) {
            if (queryOrIds instanceof VoidQuery) {
                return this.repository.find();
            } else if (queryOrIds instanceof IdsQuery) {
                return this.findAllEntitiesByIds(queryOrIds.ids);
            } else if (queryOrIds instanceof ObjectRelationsQuery) {
                return this.repository.find({
                    where: queryOrIds.value,
                    relations: queryOrIds.relations,
                });
            } else if (queryOrIds instanceof ObjectQuery) {
                return this.repository.find({where: queryOrIds.value});
            } else {
                throw new QueryNotSupportedError();
            }
        } else {
            return this.findAllEntitiesByIds(queryOrIds);
        }
    }

    put(value: T, query: Query): Promise<T>;
    put<K>(value: T, id: K): Promise<T>;
    public async put<K>(value: T, queryOrId: Query | K): Promise<T | undefined> {
        if (queryOrId instanceof Query) {
            if (queryOrId instanceof VoidQuery) {
                return this.repository.save(value);
            } else {
                throw new QueryNotSupportedError();
            }
        } else {
            throw new QueryNotSupportedError();
        }
    }

    putAll(values: T[], query: Query): Promise<T[]>;
    putAll<K>(values: T[], ids: K[]): Promise<T[]>;
    public async putAll<K>(values: T[], queryOrIds: Query | K[]): Promise<T[] | undefined> {
        if (queryOrIds instanceof Query) {
            if (queryOrIds instanceof VoidQuery) {
                return await Promise.all(values.map(value  => this.repository.save(value)));
            } else {
                throw new QueryNotSupportedError();
            }
        } else {
            throw new QueryNotSupportedError();
        }
    }

    delete(query: Query): Promise<void>;
    delete<K>(id: K): Promise<void>;
    public async delete<K>(queryOrId: Query | K): Promise<void> {
        if (queryOrId instanceof Query) {
            if (queryOrId instanceof IdQuery) {
                const entity = await this.repository.findOne(queryOrId.id);
                return this.remove(entity);
            } else {
                throw new QueryNotSupportedError();
            }
        } else {
            const entity = await this.repository.findOne(queryOrId);
            return this.remove(entity);
        }
    }

    deleteAll(query: Query): Promise<void>;
    deleteAll<K>(ids: K[]): Promise<void>;
    public async deleteAll<K>(queryOrIds: Query | K[]): Promise<void> {
        if (queryOrIds instanceof Query) {
            if (queryOrIds instanceof IdsQuery) {
                const entities = await this.findAllEntitiesByIds(queryOrIds.ids);
                return this.remove(entities);
            } else {
                throw new QueryNotSupportedError();
            }
        } else {
            const entities = await this.findAllEntitiesByIds(queryOrIds);
            return this.remove(entities);
        }
    }

    private async findAllEntitiesByIds<K>(ids: K[]): Promise<T[]> {
        const primaryColumns = this.repository.metadata.primaryColumns;
        if (!primaryColumns || primaryColumns.length !== 1) {
            throw Error('Entity has multiple primary keys');
        }
        const primaryColumnName = primaryColumns[0].propertyName;
        const conditions: any = {};
        conditions[primaryColumnName] = ids;
        return await this.repository.find({where: conditions });
    }

    private async remove(entityOrEntities: any): Promise<void> {
        if (!entityOrEntities) {
            throw new DeleteError('No entity found');
        }
        await this.repository.remove(entityOrEntities);
        return;
    }

}
