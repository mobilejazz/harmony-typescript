import {
    DeleteDataSource,
    DictionaryQuery,
    DictionaryRelationsQuery,
    GetDataSource,
    IdQuery,
    IdsQuery,
    PutDataSource,
    Query,
    QueryNotSupportedError,
    VoidQuery,
} from '@harmony/core/src';
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
            } else if (queryOrId instanceof DictionaryRelationsQuery) {
                return this.repository.findOne({
                    where: queryOrId.dictionary,
                    relations: queryOrId.relations,
                });
            } else if (queryOrId instanceof DictionaryQuery) {
                return this.repository.findOne({where: queryOrId.dictionary});
            } else {
                throw QueryNotSupportedError;
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
            } else if (queryOrIds instanceof DictionaryRelationsQuery) {
                return this.repository.find({
                    where: queryOrIds.dictionary,
                    relations: queryOrIds.relations,
                });
            } else if (queryOrIds instanceof DictionaryQuery) {
                return this.repository.find({where: queryOrIds.dictionary});
            } else {
                throw QueryNotSupportedError;
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
                throw QueryNotSupportedError;
            }
        } else {
            throw QueryNotSupportedError;
        }
    }

    putAll(values: T[], query: Query): Promise<T[]>;
    putAll<K>(values: T[], ids: K[]): Promise<T[]>;
    public async putAll<K>(values: T[], queryOrIds: Query | K[]): Promise<T[] | undefined> {
        if (queryOrIds instanceof Query) {
            if (queryOrIds instanceof VoidQuery) {
                return await Promise.all(values.map(value  => this.repository.save(value)));
            } else {
                throw QueryNotSupportedError;
            }
        } else {
            throw QueryNotSupportedError;
        }
    }

    delete(query: Query): Promise<boolean>;
    delete<K>(id: K): Promise<boolean>;
    public async delete<K>(queryOrId: Query | K): Promise<boolean> {
        if (queryOrId instanceof Query) {
            if (queryOrId instanceof IdQuery) {
                const entity = await this.repository.findOne(queryOrId.id);
                return this.remove(entity);
            } else {
                throw QueryNotSupportedError;
            }
        } else {
            const entity = await this.repository.findOne(queryOrId);
            return this.remove(entity);
        }
    }

    deleteAll(query: Query): Promise<boolean>;
    deleteAll<K>(ids: K[]): Promise<boolean>;
    public async deleteAll<K>(queryOrIds: Query | K[]): Promise<boolean> {
        if (queryOrIds instanceof Query) {
            if (queryOrIds instanceof IdsQuery) {
                const entities = await this.findAllEntitiesByIds(queryOrIds.ids);
                return this.remove(entities);
            } else {
                throw QueryNotSupportedError;
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

    private async remove(entityOrEntities: any): Promise<boolean> {
        if (!entityOrEntities) {
            return false;
        }
        await this.repository.remove(entityOrEntities);
        return true;
    }

}
