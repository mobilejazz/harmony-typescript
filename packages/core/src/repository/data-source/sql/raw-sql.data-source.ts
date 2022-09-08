import { DeleteDataSource, GetDataSource, PutDataSource } from '../data-source';
import { InvalidArgumentError, NotFoundError, QueryNotSupportedError } from '../../errors';
import {
    BaseColumnCreatedAt,
    BaseColumnDeletedAt,
    BaseColumnId,
    BaseColumnUpdatedAt,
    IdQuery,
    IdsQuery,
    PaginationOffsetLimitQuery,
    Query,
    SQLQueryParamFn,
} from '../..';
import { SQLDialect, SQLInterface } from '../../../data';
import { SQLOrderByPaginationQuery, SQLOrderByQuery, SQLWherePaginationQuery, SQLWhereQuery } from './sql.query';
import { DeviceConsoleLogger, Logger } from '../../../helpers';
import { SQLQueryParamComposer } from './sql-query-param-composer';

export type RawSQLData = Record<string, unknown>;

export interface SQLOrderBy {
    orderBy: (param: SQLQueryParamFn, dialect: SQLDialect) => string;
    ascending: () => boolean;
}

export interface SQLWhere {
    where: (param: SQLQueryParamFn, dialect: SQLDialect) => string;
}

class SQLQueryComposition {
    constructor(readonly query: string, readonly params: unknown[]) {}
}

export class RawSQLDataSource implements GetDataSource<RawSQLData>, PutDataSource<RawSQLData>, DeleteDataSource {
    constructor(
        protected readonly sqlDialect: SQLDialect,
        protected readonly sqlInterface: SQLInterface,
        protected readonly tableName: string,
        protected readonly columns: string[],
        protected readonly idColumn = BaseColumnId,
        protected readonly createdAtColumn = BaseColumnCreatedAt,
        protected readonly updatedAtColumn = BaseColumnUpdatedAt,
        protected readonly deletedAtColumn = BaseColumnDeletedAt,
        protected readonly softDeleteEnabled = false,
        protected readonly logger: Logger = new DeviceConsoleLogger(),
    ) {
        const tableColumns = [];
        if (createdAtColumn) {
            tableColumns.push(createdAtColumn);
        }
        if (updatedAtColumn) {
            tableColumns.push(updatedAtColumn);
        }
        this.tableColumns = tableColumns.concat(columns);
    }
    private tableColumns: string[] = [];

    private static getId(data: RawSQLData, queryOrId: Query): number {
        if (queryOrId instanceof IdQuery) {
            return queryOrId.id;
        } else {
            return data[BaseColumnId] as number;
        }
    }

    protected getColumnsQuery(): string {
        return [this.idColumn, ...this.tableColumns].join(', ');
    }

    protected selectSQL(): string {
        return `select ${this.getColumnsQuery()} from ${this.sqlDialect.getTableName(this.tableName)}`;
    }

    protected orderSQL(column: string, ascending: boolean): string {
        return `order by ${column} ${ascending ? 'asc' : 'desc'}`;
    }

    protected getComposition(query: Query, limit?: number, offset?: number): SQLQueryComposition {
        let whereSql = '';

        const params = new SQLQueryParamComposer(this.sqlDialect);

        if (query instanceof SQLWhereQuery || query instanceof SQLWherePaginationQuery) {
            // If query supports SQLWhere interface
            const querySQL = query.where(params.push, this.sqlDialect);
            whereSql = querySQL ? querySQL : ''; // <-- note we allow the case where the querySQL is empty (aka, no conditions!)
        }

        // Additionally, append soft deletion condition
        if (this.softDeleteEnabled) {
            if (whereSql.length > 0) {
                // If previous conditions exist, attach an "and" operator
                whereSql += ' and ';
            }
            whereSql += `${this.deletedAtColumn} is null`;
        }

        if (whereSql.length > 0) {
            // If where SQL contains any condition, append the "where" keyword, otherwise live it empty
            whereSql = `where ${whereSql}`;
        }

        let column = this.createdAtColumn;
        let ascending = true;
        if (query instanceof SQLOrderByQuery || query instanceof SQLOrderByPaginationQuery) {
            column = query.orderBy(params.push, this.sqlDialect);
            ascending = query.ascending();
        }
        const orderSQL = this.orderSQL(column, ascending);

        if (query instanceof PaginationOffsetLimitQuery) {
            offset = query.offset;
            limit = query.limit;
        }

        let limitSQL = '';
        if (limit !== undefined && offset !== undefined) {
            limitSQL = `limit ${params.push(limit)} offset ${params.push(offset)}`;
        }

        // tslint:disable-next-line:max-line-length
        const queryStr = `${this.selectSQL()} ${whereSql} ${orderSQL} ${limitSQL}`;

        return new SQLQueryComposition(queryStr, params.getParams());
    }

    async get(query: Query): Promise<RawSQLData> {
        if (query instanceof IdQuery) {
            let sql = `${this.selectSQL()} where ${this.idColumn} = ${this.sqlDialect.getParameterSymbol(1)}`;
            if (this.softDeleteEnabled) {
                sql = `${sql} and ${this.deletedAtColumn} is null`;
            }
            return this.sqlInterface
                .query<RawSQLData[]>(sql, [query.id])
                .catch((e) => {
                    throw this.sqlDialect.mapError(e);
                })
                .then((rows) => {
                    if (rows.length === 0) {
                        throw new NotFoundError();
                    } else {
                        return rows[0];
                    }
                });
        } else {
            const composition = this.getComposition(query, 1, 0);
            return this.sqlInterface
                .query<RawSQLData[]>(composition.query, composition.params)
                .catch((e) => {
                    throw this.sqlDialect.mapError(e);
                })
                .then((rows) => {
                    if (rows.length === 0) {
                        throw new NotFoundError();
                    } else {
                        return rows[0];
                    }
                });
        }
    }

    // Returns the content of the 'in (...)' statement for the number of given arguments.
    private inStatement(count: number): string {
        return Array(count)
            .fill(0)
            .map((_value, idx) => this.sqlDialect.getParameterSymbol(idx + 1))
            .join(', ');
    }

    async getAll(query: Query): Promise<RawSQLData[]> {
        if (query instanceof IdsQuery) {
            let sql = `${this.selectSQL()} where ${this.idColumn} in (${this.inStatement(query.ids.length)})`;
            if (this.softDeleteEnabled) {
                sql = `${sql} and ${this.deletedAtColumn} is null`;
            }
            return this.sqlInterface.query(sql, query.ids);
        } else {
            const composition = this.getComposition(query);
            return this.sqlInterface.query<RawSQLData[]>(composition.query, composition.params).catch((e) => {
                throw this.sqlDialect.mapError(e);
            });
        }
    }

    private updateSQLQuery(value: RawSQLData): string {
        const paramList = this.tableColumns
            .filter((column) => value[column] !== undefined)
            .map((column, idx) => `${column} = ${this.sqlDialect.getParameterSymbol(idx + 1)}`);
        const params = paramList.join(',');
        // tslint:disable-next-line:max-line-length
        return `update ${this.sqlDialect.getTableName(this.tableName)} set ${params} where ${
            this.idColumn
        } = ${this.sqlDialect.getParameterSymbol(paramList.length + 1)}`;
    }

    private updateSQLParams(id: number, value: RawSQLData): unknown[] {
        const params = this.tableColumns.filter((column) => value[column] !== undefined).map((column) => value[column]);
        params.push(id);
        return params;
    }

    private insertSQLQuery(value: RawSQLData): string {
        const params: string[] = [];
        const values: unknown[] = [];
        this.tableColumns
            .filter((column) => value[column] !== undefined)
            .forEach((column, idx) => {
                params.push(`${column}`);
                values.push(this.sqlDialect.getParameterSymbol(idx + 1));
            });
        // tslint:disable-next-line:max-line-length
        return `insert into ${this.sqlDialect.getTableName(this.tableName)} (${params.join(',')}) values (${values.join(
            ',',
        )}) ${this.sqlDialect.getInsertionIdQueryStatement(this.idColumn)}`;
    }

    private insertSQLQueryParams(value: RawSQLData): unknown[] {
        return this.tableColumns.filter((column) => value[column] !== undefined).map((column) => value[column]);
    }

    // Subclasses can override
    public postInsert(_sqlInterface: SQLInterface, _insertionId: number): Promise<void> {
        return Promise.resolve();
    }

    // Subclasses can override
    public postUpdate(_sqlInterface: SQLInterface, _updateId: number): Promise<void> {
        return Promise.resolve();
    }

    // This method executes the put query.
    // If desired, call it inside a transaction.
    private executePutQuery(value: RawSQLData, id: number, sqlInterface: SQLInterface): Promise<number> {
        const isInsertion = id === undefined || id === null;
        return sqlInterface
            .query(
                isInsertion ? this.insertSQLQuery(value) : this.updateSQLQuery(value),
                isInsertion ? this.insertSQLQueryParams(value) : this.updateSQLParams(id, value),
            )
            .then((result) => {
                if (isInsertion) {
                    const rowId = this.sqlDialect.getInsertionId(result, this.idColumn);
                    // After a succesfull insertion, checking if subclasses
                    // might want to perform any further action within the same
                    // transaction scope.
                    return this.postInsert(sqlInterface, rowId).then(() => rowId);
                } else {
                    const rowId = id;
                    // After a succesfull udpate, checking if subclasses
                    // might want to perform any further action within the same
                    // transaction scope.
                    return this.postUpdate(sqlInterface, rowId).then(() => rowId);
                }
            });
    }

    async put(value: RawSQLData | undefined, query: Query): Promise<RawSQLData> {
        if (typeof value === 'undefined') {
            throw new InvalidArgumentError(`RawSQLDataSource: value can't be undefined`);
        }

        const id = RawSQLDataSource.getId(value, query);
        return this.sqlInterface
            .transaction((sqlInterface: SQLInterface) => this.executePutQuery(value, id, sqlInterface))
            .then((rowId) => this.get(new IdQuery(rowId)))
            .catch((e) => {
                throw this.sqlDialect.mapError(e);
            });
    }

    async putAll(values: RawSQLData[] | undefined, query: Query): Promise<RawSQLData[]> {
        if (typeof values === 'undefined') {
            throw new InvalidArgumentError(`RawSQLDataSource: values can't be undefined`);
        }

        if (query instanceof IdsQuery) {
            if (values.length !== query.ids.length) {
                // tslint:disable-next-line:max-line-length
                throw new InvalidArgumentError(
                    `Error in PutAll: Length of ids (${query.ids.length}) doesn't match the array of values (${values.length})`,
                );
            }
        }
        const insertionIds = await this.sqlInterface.transaction((sqlInterface: SQLInterface) => {
            return Promise.all(
                values.map((value, idx) => {
                    let id = value[BaseColumnId] as number;
                    if (!id && query instanceof IdsQuery) {
                        id = query.ids[idx];
                    }
                    return this.executePutQuery(value, id, sqlInterface);
                }),
            );
        });

        // Finally, select all data
        return this.getAll(new IdsQuery(insertionIds)).catch((e) => {
            throw this.sqlDialect.mapError(e);
        });
    }

    public async delete(query: Query): Promise<void> {
        if (this.softDeleteEnabled) {
            if (query instanceof IdQuery) {
                return (
                    this.sqlInterface
                        // tslint:disable-next-line:max-line-length
                        .query(
                            `update ${this.sqlDialect.getTableName(this.tableName)} set ${
                                this.deletedAtColumn
                            } = now() where ${this.idColumn} = ${this.sqlDialect.getParameterSymbol(1)}`,
                            [query.id],
                        )
                        .then(() => Promise.resolve())
                        .catch((e) => {
                            throw this.sqlDialect.mapError(e);
                        })
                );
            } else if (query instanceof IdsQuery) {
                return (
                    this.sqlInterface
                        // tslint:disable-next-line:max-line-length
                        .query(
                            `update ${this.sqlDialect.getTableName(this.tableName)} set ${
                                this.deletedAtColumn
                            } = now() where ${this.idColumn} in (${this.inStatement(query.ids.length)})`,
                            query.ids,
                        )
                        .then(() => Promise.resolve())
                        .catch((e) => {
                            throw this.sqlDialect.mapError(e);
                        })
                );
            } else if (query instanceof SQLWhereQuery || query instanceof SQLWherePaginationQuery) {
                const params = new SQLQueryParamComposer(this.sqlDialect);
                return (
                    this.sqlInterface
                        // tslint:disable-next-line:max-line-length
                        .query(
                            `update ${this.sqlDialect.getTableName(this.tableName)} set ${
                                this.deletedAtColumn
                            } = now() where ${query.where(params.push, this.sqlDialect)}`,
                            params.getParams(),
                        )
                        .then(() => Promise.resolve())
                        .catch((e) => {
                            throw this.sqlDialect.mapError(e);
                        })
                );
            }
        } else {
            if (query instanceof IdQuery) {
                return (
                    this.sqlInterface
                        // tslint:disable-next-line:max-line-length
                        .query(
                            `delete from ${this.sqlDialect.getTableName(this.tableName)} where ${
                                this.idColumn
                            } = ${this.sqlDialect.getParameterSymbol(1)}`,
                            [query.id],
                        )
                        .then(() => Promise.resolve())
                        .catch((e) => {
                            throw this.sqlDialect.mapError(e);
                        })
                );
            } else if (query instanceof IdsQuery) {
                return (
                    this.sqlInterface
                        // tslint:disable-next-line:max-line-length
                        .query(
                            `delete from ${this.sqlDialect.getTableName(this.tableName)} where ${
                                this.idColumn
                            } in (${this.inStatement(query.ids.length)})`,
                            query.ids,
                        )
                        .then(() => Promise.resolve())
                        .catch((e) => {
                            throw this.sqlDialect.mapError(e);
                        })
                );
            } else if (query instanceof SQLWhereQuery || query instanceof SQLWherePaginationQuery) {
                const params = new SQLQueryParamComposer(this.sqlDialect);
                return (
                    this.sqlInterface
                        // tslint:disable-next-line:max-line-length
                        .query(
                            `delete from ${this.sqlDialect.getTableName(this.tableName)} where ${query.where(
                                params.push,
                                this.sqlDialect,
                            )}`,
                            params.getParams(),
                        )
                        .then(() => Promise.resolve())
                        .catch((e) => {
                            throw this.sqlDialect.mapError(e);
                        })
                );
            }
        }

        throw new QueryNotSupportedError();
    }
}
