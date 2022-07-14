import { Repository as TypeORMRepository, In, FindManyOptions } from 'typeorm';
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
} from '@mobilejazz/harmony-core';

export class TypeOrmDataSource<T> implements GetDataSource<T>, PutDataSource<T>, DeleteDataSource {
    constructor(
        private readonly repository: TypeORMRepository<T>,
        private readonly logger: Logger = new DeviceConsoleLogger(),
    ) {}

    public async get(query: Query): Promise<T> {
        if (query instanceof IdQuery) {
            const id: string | number = query.id;
            return this.repository.findOne(id).then((value) => {
                if (typeof value === 'undefined') {
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
                    if (value === undefined) {
                        throw new NotFoundError();
                    } else {
                        return value;
                    }
                });
        } else if (query instanceof ObjectQuery) {
            return this.repository.findOne({ where: this.buildArrayQuery(query.value) }).then((value) => {
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
            const id: string | number = query.id;
            const entity = await this.repository.findOne(id);
            return this.remove(entity);
        } else if (query instanceof IdsQuery) {
            const entities = await this.findAllEntitiesByIds(query.ids);
            return this.remove(entities);
        } else {
            throw new QueryNotSupportedError();
        }
    }

    private buildArrayQuery(conditions: Record<string, unknown>): Record<string, unknown> {
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
        const options: FindManyOptions<T> = {
            where: {
                [primaryColumnName]: In(ids)
            }
        };

        return await this.repository.find(options);
    }

    private async remove(entityOrEntities: T | T[] | undefined): Promise<void> {
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
