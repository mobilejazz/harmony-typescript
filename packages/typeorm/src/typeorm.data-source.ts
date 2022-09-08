import type { Repository as TypeORMRepository, FindManyOptions, ObjectLiteral, FindOptionsWhere } from 'typeorm';
import { In } from 'typeorm';
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
    InvalidArgumentError,
    BaseColumnId,
} from '@mobilejazz/harmony-core';

export class TypeOrmDataSource<T extends ObjectLiteral> implements GetDataSource<T>, PutDataSource<T>, DeleteDataSource {
    constructor(
        private readonly repository: TypeORMRepository<T>,
        private readonly idColumn = BaseColumnId,
        private readonly logger: Logger = new DeviceConsoleLogger(),
    ) {}

    public async get(query: Query): Promise<T> {
        if (query instanceof IdQuery) {
            return this.repository.findOneBy(this.getIdWhere(query)).then((value) => {
                if (this.isEmptyValue(value)) {
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
                })
                .then((value) => {
                    if (this.isEmptyValue(value)) {
                        throw new NotFoundError();
                    } else {
                        return value;
                    }
                });
        } else if (query instanceof ObjectQuery) {
            return this.repository.findOne({ where: this.buildArrayQuery(query.value) }).then((value) => {
                if (this.isEmptyValue(value)) {
                    throw new NotFoundError();
                } else {
                    return value;
                }
            });
        } else {
            throw new QueryNotSupportedError();
        }
    }

    public async getAll(query: Query): Promise<T[]> {
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

    public async put(value: T | undefined, query: Query): Promise<T> {
        if (query instanceof VoidQuery) {
            if (typeof value !== 'undefined') {
                return this.repository.save(value);
            } else {
                throw new InvalidArgumentError();
            }
        } else {
            throw new QueryNotSupportedError();
        }
    }

    public async putAll(values: T[] | undefined, query: Query): Promise<T[]> {
        if (query instanceof VoidQuery) {
            if (typeof values !== 'undefined') {
                return await Promise.all(values.map((value) => this.repository.save(value)));
            } else {
                throw new InvalidArgumentError();
            }
        } else {
            throw new QueryNotSupportedError();
        }
    }

    public async delete(query: Query): Promise<void> {
        if (query instanceof IdQuery) {
            const entity = await this.repository.findOneBy(this.getIdWhere(query));
            return this.remove(entity);
        } else if (query instanceof IdsQuery) {
            const entities = await this.findAllEntitiesByIds(query.ids);
            return this.remove(entities);
        } else {
            throw new QueryNotSupportedError();
        }
    }

    private buildArrayQuery(conditions: Record<string, unknown>): FindOptionsWhere<T> {
        const obj = Object.assign(conditions);

        for (const key in conditions) {
            if (Object.prototype.hasOwnProperty.call(conditions, key)) {
                // If one of the condition is an array put the In() prefix operator
                const value = conditions[key];

                if (Array.isArray(value)) {
                    obj[key] = In(value);
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
        const where = this.toWhereType({
            [primaryColumnName]: In(ids)
        });

        return await this.repository.find({ where });
    }

    /**
     * Map `IdQuery` to TypeORM where object
     */
    private getIdWhere(query: IdQuery<string | number>): FindOptionsWhere<T> {
        return this.toWhereType({ [this.idColumn]: query.id });
    }

    /**
     * Utility method to appease TypeScript type checker
     */
    private toWhereType(where: Record<string, unknown>): FindOptionsWhere<T> {
        // We use `as …`, otherwise we get a type error when using variable accessor, e.g: `{ [this.idColumn]: 42 }`
        // Hardcoded properties work OK though. E.g. `{ id: 42 }`
        return where as FindOptionsWhere<T>;
    }

    private isEmptyValue(value: T | undefined | null): value is (undefined | null) {
        return typeof value === 'undefined' || value === null;
    }

    private async remove(entityOrEntities: T | T[] | undefined | null): Promise<void> {
        if (!entityOrEntities) {
            throw new DeleteError('No entity found');
        }

        // Type narrowing to by-pass method overloading TS error
        // See: https://stackoverflow.com/q/66349734/379923
        if (Array.isArray(entityOrEntities)) {
            await this.repository.remove(entityOrEntities);
        } else {
            await this.repository.remove(entityOrEntities);
        }
    }
}
