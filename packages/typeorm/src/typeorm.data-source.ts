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
    DeleteError,
    NotFoundError,
    Logger,
    DeviceConsoleLogger,
} from '@mobilejazz/harmony-core';
import { Repository as TypeORMRepository, In } from 'typeorm';

export class TypeOrmDataSource<T> implements GetDataSource<T>, PutDataSource<T>, DeleteDataSource {
    constructor(
        private readonly repository: TypeORMRepository<T>,
        private readonly logger: Logger = new DeviceConsoleLogger(),
    ) {}

    async get(query: Query): Promise<T> {
        if (query instanceof IdQuery) {
            return this.repository
                .findOne(query.id)
                .then((value: any) => {
                    if (value === undefined) {
                        throw new NotFoundError();
                    } else {
                        return value;
                    }
                });
        } else if (query instanceof ObjectRelationsQuery) {
            return this.repository
                .findOne({
                    where: this.buildArrayQuery(query.value),
                    relations: query.relations,
                }).then((value: any) => {
                    if (value === undefined) {
                        throw new NotFoundError();
                    } else {
                        return value;
                    }
                });
        } else if (query instanceof ObjectQuery) {
            return this.repository
                .findOne({ where: this.buildArrayQuery(query.value) })
                .then((value: any) => {
                    if (value === undefined) {
                        throw new NotFoundError();
                    } else {
                        return value;
                    }
                });
        } else {
            throw new QueryNotSupportedError();
        }
    }

    async getAll(query: Query): Promise<T[]> {
            if (query instanceof VoidQuery) {
                return this.repository.find();
            } else if (query instanceof IdsQuery) {
                return this.findAllEntitiesByIds(query.ids);
            } else if (query instanceof ObjectRelationsQuery) {
                return this.repository.find({
                    where: this.buildArrayQuery(query.value),
                    relations: query.relations,
                });
            } else if (query instanceof ObjectQuery) {
                return this.repository.find({ where: this.buildArrayQuery(query.value) });
            } else {
                throw new QueryNotSupportedError();
            }
    }

    async put(value: T, query: Query): Promise<T> {
        if (query instanceof VoidQuery) {
            return this.repository.save(value);
        } else {
            throw new QueryNotSupportedError();
        }
    }

    async putAll(values: T[], query: Query): Promise<T[]> {
        if (query instanceof VoidQuery) {
            return await Promise.all(values.map(value => this.repository.save(value)));
        } else {
            throw new QueryNotSupportedError();
        }
    }

    async delete(query: Query): Promise<void> {
        if (query instanceof IdQuery) {
            const entity = await this.repository.findOne(query.id);
            return this.remove(entity);
        } else if (query instanceof IdsQuery) {
            const entities = await this.findAllEntitiesByIds(query.ids);
            return this.remove(entities);
        } else {
            throw new QueryNotSupportedError();
        }
    }

    async deleteAll(query: Query): Promise<void> {
        this.logger.warning('[DEPRECATION] `deleteAll` will be deprecated. Calling `delete` instead.');
        return this.delete(query);
    }

    private buildArrayQuery(conditions: any): any {
        const obj = Object.assign(conditions);
        for (const key in conditions) {
            if (conditions.hasOwnProperty(key)) {
                // If one of the condition is an array put the In() prefix operator
                if (Array.isArray(conditions[key])) {
                    obj[key] = In(conditions[key]);
                }
            }
        }
        return obj;
    }

    private async findAllEntitiesByIds<K>(ids: K[]): Promise<T[]> {
        const primaryColumns = this.repository.metadata.primaryColumns;
        if (!primaryColumns || primaryColumns.length !== 1) {
            throw Error('Entity has multiple primary keys');
        }
        const primaryColumnName = primaryColumns[0].propertyName;
        const conditions: any = {};
        conditions[primaryColumnName] = In(ids);
        return await this.repository.find({ where: conditions });
    }

    private async remove(entityOrEntities: any): Promise<void> {
        if (!entityOrEntities) {
            throw new DeleteError('No entity found');
        }
        await this.repository.remove(entityOrEntities);
        return;
    }
}
