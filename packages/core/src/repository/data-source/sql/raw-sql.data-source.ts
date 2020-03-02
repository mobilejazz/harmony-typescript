import {
    GetDataSource,
    PutDataSource,
    DeleteDataSource,
} from "../data-source";
import {
    InvalidArgumentError,
    NotFoundError,
    QueryNotSupportedError,
} from "../../errors";
import {
    BaseColumnCreatedAt,
    BaseColumnUpdatedAt,
    BaseColumnId,
    IdQuery,
    IdsQuery,
    PaginationOffsetLimitQuery,
    Query,
} from "../..";
import {
    SQLDialect,
    SQLInterface,
} from "../../../data";
import {
    SQLOrderByPaginationQuery,
    SQLOrderByQuery,
    SQLWherePaginationQuery,
    SQLWhereQuery,
} from "./sql.query";
import {DeviceConsoleLogger, Logger} from '../../../helpers';

export type RawSQLData = any;

export interface SQLOrderBy {
    orderBy(): string;
    ascending(): boolean;
}

export interface SQLWhere {
    whereSql(dialect: SQLDialect): string;
    whereParams(): any[];
}

class SQLQueryComposition {
    constructor(
        readonly query: string,
        readonly params: any[],
    ) {}
}

export class RawSQLDataSource implements GetDataSource<RawSQLData>, PutDataSource<RawSQLData>, DeleteDataSource {
    private tableColumns: string[] = [];

    constructor(
        protected readonly sqlDialect: SQLDialect,
        protected readonly sqlInterface: SQLInterface,
        protected readonly tableName: string,
        protected readonly columns: string[],
        protected readonly idColumn = BaseColumnId,
        protected readonly createdAtColumn = BaseColumnCreatedAt,
        protected readonly updatedAtColumn = BaseColumnUpdatedAt,
        protected readonly logger: Logger = new DeviceConsoleLogger(),
    ) {
        let tableColumns = [];
        if (createdAtColumn) {
            tableColumns.push(createdAtColumn);
        }
        if (updatedAtColumn) {
            tableColumns.push(updatedAtColumn);
        }
        this.tableColumns = tableColumns.concat(columns);
    }

    private getColumnsQuery(): string {
        return [this.idColumn, ...this.tableColumns].join(', ');
    }

    protected orderSQL(column: string, ascending: boolean): string {
        return `order by ${column} ${(ascending ? 'asc' : 'desc')}`;
    }

    protected limitSQL(limitIdx: number, offsetIdx: number): string {
        return `limit ${this.sqlDialect.getParameterSymbol(limitIdx)} offset ${this.sqlDialect.getParameterSymbol(offsetIdx)}`;
    }

    protected getComposition(query: Query, limit?: number, offset?: number): SQLQueryComposition {
        let whereParams = [];
        let whereParamsLength = 0;
        let whereSql = "";

        if (query instanceof SQLWhereQuery || query instanceof SQLWherePaginationQuery) {
            whereParams = query.whereParams();
            whereParamsLength = whereParams.length;
            whereSql = `where ${query.whereSql(this.sqlDialect)}`;
        }

        let column = this.createdAtColumn;
        let ascending = true;
        if (query instanceof SQLOrderByQuery || query instanceof SQLOrderByPaginationQuery) {
            column = query.orderBy();
            ascending = query.ascending();
        }
        const orderSQL = this.orderSQL(column, ascending);

        if (query instanceof PaginationOffsetLimitQuery) {
            offset = query.offset;
            limit = query.limit;
        }

        let limitSQL = "";
        if (limit !== undefined && offset !== undefined) {
            limitSQL = this.limitSQL(whereParamsLength + 1, whereParamsLength + 2);
            whereParams.push(limit);
            whereParams.push(offset);
        }

        // tslint:disable-next-line:max-line-length
        const queryStr = `select ${this.getColumnsQuery()} from ${this.sqlDialect.getTableName(this.tableName)} ${whereSql} ${orderSQL} ${limitSQL}`;

        return new SQLQueryComposition(queryStr, whereParams);
    }
    async get(query: Query): Promise<RawSQLData> {
        if (query instanceof IdQuery) {
            return this.sqlInterface
                // tslint:disable-next-line:max-line-length
                .query(`select ${this.getColumnsQuery()} from ${this.sqlDialect.getTableName(this.tableName)} where ${this.idColumn} = ${this.sqlDialect.getParameterSymbol(1)}`, [query.id])
                .catch(e => {
                    throw this.sqlDialect.mapError(e);
                })
                .then(rows => {
                    if (rows.length === 0) {
                        throw new NotFoundError();
                    } else {
                        return rows[0];
                    }
                });
        } else {
            const composition = this.getComposition(query, 1, 0);
            return this.sqlInterface
                .query(composition.query, composition.params)
                .catch(e => { throw this.sqlDialect.mapError(e); })
                .then(rows => {
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
        return Array(count).fill(0)
            .map((_value, idx) => this.sqlDialect.getParameterSymbol(idx + 1))
            .join(', ');
    }

    async getAll(query: Query): Promise<RawSQLData[]> {
        if (query instanceof IdsQuery) {
            // tslint:disable-next-line:max-line-length
            return this.sqlInterface.query(`select ${this.getColumnsQuery()} from ${this.sqlDialect.getTableName(this.tableName)} where ${this.idColumn} in (${this.inStatement(query.ids.length)})`, query.ids);
        } else {
            const composition = this.getComposition(query);
            return this.sqlInterface
                .query(composition.query, composition.params)
                .catch(e => { throw this.sqlDialect.mapError(e); });
        }
    }

    private getId(data: RawSQLData, queryOrId: Query): number {
        let id = null;
        if (queryOrId instanceof IdQuery) {
            id = queryOrId.id;
        } else {
            id = data[BaseColumnId];
        }
        return id;
    }

    private updateSQLQuery(value: RawSQLData): string {
        const paramList = this.tableColumns
            .filter(column => value[column] !== undefined)
            .map((column, idx) => `${column} = ${this.sqlDialect.getParameterSymbol(idx + 1)}`);
        const params = paramList.join(',');
        // tslint:disable-next-line:max-line-length
        return `update ${this.sqlDialect.getTableName(this.tableName)} set ${params} where ${this.idColumn} = ${this.sqlDialect.getParameterSymbol(paramList.length + 1)}`;
    }

    private updateSQLParams(id: any, value: RawSQLData): any[] {
        let params = this.tableColumns
            .filter(column => value[column] !== undefined)
            .map(column => value[column]);
        params.push(id);
        return params;
    }

    private insertSQLQuery(value: RawSQLData): string {
        let params: string[] = [];
        let values: any[] = [];
        this.tableColumns
            .filter(column => value[column] !== undefined)
            .forEach((column, idx) => {
                params.push(`${column}`);
                values.push(this.sqlDialect.getParameterSymbol(idx + 1));
            });
        // tslint:disable-next-line:max-line-length
        return `insert into ${this.sqlDialect.getTableName(this.tableName)} (${params.join(',')}) values (${values.join(',')}) ${this.sqlDialect.getInsertionIdQueryStatement(this.idColumn)}`;
    }

    private insertSQLQueryParams(value: RawSQLData): any[] {
        return this.tableColumns
            .filter(column => value[column] !== undefined)
            .map(column => value[column]);
    }

    // Subclasses can override
    public postInsert(sqlInterface: SQLInterface, insertionId: number): Promise<void> {
        return Promise.resolve();
    }

    // Subclasses can override
    public postUpdate(sqlInterface: SQLInterface, updateId: number): Promise<void> {
        return Promise.resolve();
    }

    // This method executes the put query.
    // If desired, call it inside a transaction.
    private executePutQuery(value: RawSQLData, id: number, sqlInterface: SQLInterface): Promise<number> {
        const isInsertion = id === undefined || id === null;
        return sqlInterface.query(
            isInsertion ? this.insertSQLQuery(value) : this.updateSQLQuery(value),
            isInsertion ? this.insertSQLQueryParams(value) : this.updateSQLParams(id, value),
        ).then(result => {
            if (isInsertion) {
                const rowId = this.sqlDialect.getInsertionId(result);
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

    async put(value: RawSQLData, query: Query): Promise<RawSQLData> {
        let id = this.getId(value, query);
        return this.sqlInterface.transaction((sqlInterface: SQLInterface) => {
            return this.executePutQuery(value, id, sqlInterface);
        })
            .then(rowId => this.get(new IdQuery(rowId)))
            .catch(e => { throw this.sqlDialect.mapError(e); });
    }

    async putAll(values: RawSQLData[], query: Query): Promise<RawSQLData[]> {
        if (query instanceof IdsQuery) {
            if (values.length !== query.ids.length) {
                // tslint:disable-next-line:max-line-length
                throw new InvalidArgumentError(`Error in PutAll: Length of ids (${query.ids.length}) doesn't match the array of values (${values.length})`);
            }
        }
        const insertionIds = await this.sqlInterface.transaction((sqlInterface: SQLInterface) => {
            return Promise.all(values.map((value, idx) => {
                let id = value[BaseColumnId];
                if (!id && query instanceof IdsQuery) {
                    id = query.ids[idx];
                }
                return this.executePutQuery(value, id, sqlInterface);
            }));
        });

        // Finally, select all data
        return this.getAll(new IdsQuery(insertionIds))
            .catch(e => { throw this.sqlDialect.mapError(e); });
    }

    async delete(query: Query): Promise<void> {
        if (query instanceof IdQuery) {
            return this.sqlInterface
                // tslint:disable-next-line:max-line-length
                .query(`delete from ${this.sqlDialect.getTableName(this.tableName)} where ${this.idColumn} = ${this.sqlDialect.getParameterSymbol(1)}`, [query.id])
                .then(() => Promise.resolve())
                .catch(e => { throw this.sqlDialect.mapError(e); });
        } else if (query instanceof IdsQuery) {
            return this.sqlInterface
                // tslint:disable-next-line:max-line-length
                .query(`delete from ${this.sqlDialect.getTableName(this.tableName)} where ${this.idColumn} in (${this.inStatement(query.ids.length)})`, query.ids)
                .then(() => Promise.resolve())
                .catch(e => { throw this.sqlDialect.mapError(e); });
        } else if (query instanceof SQLWhereQuery || query instanceof SQLWherePaginationQuery) {
            return this.sqlInterface
                // tslint:disable-next-line:max-line-length
                .query(`delete from ${this.sqlDialect.getTableName(this.tableName)} where ${query.whereSql(this.sqlDialect)}`, query.whereParams())
                .then(() => Promise.resolve())
                .catch(e => { throw this.sqlDialect.mapError(e); });
        }

        throw new QueryNotSupportedError();
    }

    async deleteAll(query: Query): Promise<void> {
        // tslint:disable-next-line:max-line-length
        this.logger.warning('[DEPRECATION] `deleteAll` will be deprecated. Calling `delete` instead.');
        return this.delete(query);
    }
}
