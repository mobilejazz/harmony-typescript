import { DataSource } from '../data-source';
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

export abstract class AbstractRawSQLDataSource<T> implements DataSource<T> {
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
    protected tableColumns: string[] = [];

    protected static getId(data: RawSQLData, queryOrId: Query): number {
        if (queryOrId instanceof IdQuery) {
            return queryOrId.id;
        }

        return data[BaseColumnId] as number;
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

    // Returns the content of the 'in (...)' statement for the number of given arguments.
    protected inStatement(count: number): string {
        return Array(count)
            .fill(0)
            .map((_value, idx) => this.sqlDialect.getParameterSymbol(idx + 1))
            .join(', ');
    }

    protected updateSQLQuery(value: RawSQLData): string {
        const paramList = this.tableColumns
            .filter((column) => value[column] !== undefined)
            .map((column, idx) => `${column} = ${this.sqlDialect.getParameterSymbol(idx + 1)}`);
        const params = paramList.join(',');
        // tslint:disable-next-line:max-line-length
        return `update ${this.sqlDialect.getTableName(this.tableName)} set ${params} where ${
            this.idColumn
        } = ${this.sqlDialect.getParameterSymbol(paramList.length + 1)}`;
    }

    protected updateSQLParams(id: number, value: RawSQLData): unknown[] {
        const params = this.tableColumns.filter((column) => value[column] !== undefined).map((column) => value[column]);
        params.push(id);
        return params;
    }

    protected insertSQLQuery(value: RawSQLData): string {
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

    protected insertSQLQueryParams(value: RawSQLData): unknown[] {
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
    protected executePutQuery(value: RawSQLData, id: number, sqlInterface: SQLInterface): Promise<number> {
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

    abstract get(query: Query): Promise<T>;

    abstract put(value: T | undefined, query: Query): Promise<T>;

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
