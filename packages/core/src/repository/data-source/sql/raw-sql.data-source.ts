import {GetDataSource, PutDataSource, DeleteDataSource} from "../data-source";
import {
    FailedError,
    ForbiddenError,
    InvalidArgumentError,
    NotFoundError,
    QueryNotSupportedError,
} from "../../errors";
import {
    IdQuery,
    IdsQuery,
    PaginationOffsetLimitQuery,
    Query,
} from "../..";
import {SQLDialect, SQLInterface} from "../../../data";
import {BaseColumnId} from "./sql.constants";
import {
    SQLOrderByPaginationQuery,
    SQLOrderByQuery,
    SQLWherePaginationQuery,
    SQLWhereQuery,
} from "./sql.query";

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
        protected readonly idColumn = 'id',
        protected readonly createdAtColumn = 'created_at',
        protected readonly updatedAtColumn = 'updated_at',
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
        let columnsStr = this.idColumn;
        this.tableColumns.forEach(column => {
            columnsStr += `, ${column}`;
        });
        return columnsStr;
    }

    protected orderLimitSQL(limitIdx: number, offsetIdx: number, column: string, ascending: boolean): string {
        // tslint:disable-next-line:max-line-length
        return `order by ${column} ${(ascending ? 'asc' : 'desc')} limit ${this.sqlDialect.getParameterSymbol(limitIdx)} offset ${this.sqlDialect.getParameterSymbol(offsetIdx)}`;
    }

    protected getComposition(query: Query, limit = 10, offset = 0): SQLQueryComposition {
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

        if (query instanceof PaginationOffsetLimitQuery) {
            offset = query.offset;
            limit = query.limit;
        }

        const orderLimitSQL = this.orderLimitSQL(whereParamsLength + 1, whereParamsLength + 2, column, ascending);
        const params = whereParams.concat([limit, offset]);
        // tslint:disable-next-line:max-line-length
        const queryStr = `select ${this.getColumnsQuery()} from ${this.sqlDialect.getTableName(this.tableName)} ${whereSql} ${orderLimitSQL}`;

        return new SQLQueryComposition(queryStr, params);
    }
    async get(query: Query): Promise<RawSQLData> {
        let columnsStr = this.idColumn;
        this.tableColumns.forEach(column => {
            columnsStr += `, ${column}`;
        });
        if (query instanceof IdQuery) {
            return this.sqlInterface
                // tslint:disable-next-line:max-line-length
                .query(`select ${columnsStr} from ${this.sqlDialect.getTableName(this.tableName)} where ${this.idColumn} = ${this.sqlDialect.getParameterSymbol(1)}`, [query.id])
                .then(rows => {
                    if (rows.length === 0) {
                        throw new NotFoundError();
                    } else {
                        return rows[0];
                    }
                })
                .catch(e => {
                    throw this.sqlDialect.mapError(e);
                });
        } else {
            const composition = this.getComposition(query, 1, 0);
            return this.sqlInterface
                .query(composition.query, composition.params)
                .then(rows => {
                    if (rows.length === 0) {
                        throw new NotFoundError();
                    } else {
                        return rows[0];
                    }
                })
                .catch(e => { throw this.sqlDialect.mapError(e); });
        }
    }

    // Returns the content of the 'in (...)' statement for the number of given arguments.
    private inStatement(count: number): string {
        let string = '';
        for (let i = 0; i < count; i++) {
            string = string + `${this.sqlDialect.getParameterSymbol(i + 1)}`;
            if (i < count - 1) {
                string = string + ', ';
            }
        }
        return string;
    }

    async getAll(query: Query): Promise<RawSQLData[]> {
        if (query instanceof IdsQuery) {
            // tslint:disable-next-line:max-line-length
            return this.sqlInterface.query(`select ${this.getColumnsQuery()} from ${this.sqlDialect.getTableName(this.tableName)} where ${this.idColumn} in (${this.inStatement(query.ids.length)})`, query.ids);
        } else {
            console.log("Query: ", query);
            const composition = this.getComposition(query);
            return this.sqlInterface
                .query(composition.query, composition.params)
                .then(result => {
                    console.log("result: ", result);
                    return result;
                })
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
        let paramList: any[] = [];
        let counter = 0;
        this.tableColumns.forEach(column => {
            if (value[column] !== undefined) {
                counter += 1;
                paramList.push(`${column} = ${this.sqlDialect.getParameterSymbol(counter)}`);
            }
        });
        let params = paramList.join(',');
        counter += 1;
        // tslint:disable-next-line:max-line-length
        return `update ${this.sqlDialect.getTableName(this.tableName)} set ${params} where ${this.idColumn} = ${this.sqlDialect.getParameterSymbol(counter)}`;
    }

    private updateSQLParams(id: any, value: RawSQLData): any[] {
        let params: any[] = [];
        this.tableColumns.forEach(column => {
            if (value[column] !== undefined) {
                params.push(value[column]);
            }
        });
        params.push(id);
        return params;
    }

    private insertSQLQuery(value: RawSQLData): string {
        let paramList: any[] = [];
        let valueList: any[] = [];
        let counter = 0;
        this.tableColumns.forEach((column, idx) => {
            if (value[column] !== undefined) {
                paramList.push(`${column}`);
                counter += 1;
                valueList.push(this.sqlDialect.getParameterSymbol(counter));
            }
        });
        let params = `(${paramList.join(',')})`;
        let values = `(${valueList.join(',')})`;
        // tslint:disable-next-line:max-line-length
        return `insert into ${this.sqlDialect.getTableName(this.tableName)} ${params} values ${values} ${this.sqlDialect.getInsertionIdQueryStatement(this.idColumn)}`;
    }

    private insertSQLQueryParams(value: RawSQLData): any[] {
        let params: any[] = [];
        this.tableColumns.forEach(column => {
            if (value[column] !== undefined) {
                params.push(value[column]);
            }
        });
        return params;
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
        const isInsertion = !(id !== undefined && id !== null);
        return sqlInterface.query(
            isInsertion ? this.insertSQLQuery(value) : this.updateSQLQuery(value),
            isInsertion ? this.insertSQLQueryParams(value) : this.updateSQLParams(id, value),
        ).then(result => {
            // TODO: Fix this
            // When the insertion/update fails (for example, because of a unique constraint),
            // no error is generated and the result contains insertId = 0
            let rowId = id ? id : this.sqlDialect.getInsertionId(result);
            if (isInsertion) {
                // After a succesfull insertion, checking if subclasses
                // might want to perform any further action within the same
                // transaction scope.
                return this.postInsert(sqlInterface, rowId)
                    .then(() => rowId);
            } else {
                // After a succesfull udpate, checking if subclasses
                // might want to perform any further action within the same
                // transaction scope.
                return this.postUpdate(sqlInterface, rowId)
                    .then(() => rowId);
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
        }
        throw new QueryNotSupportedError();
    }

    async deleteAll(query: Query): Promise<void> {
        if (query instanceof IdsQuery) {
            // TODO: Double check this works
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
}
