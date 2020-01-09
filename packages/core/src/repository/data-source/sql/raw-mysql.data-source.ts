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
import {SQLInterface} from "../../../data";
import {MysqlError} from "mysql";
import {BaseColumnId, RawMysqlData} from "./sql.constants";
import {SQLOrderByPaginationQuery, SQLOrderByQuery, SQLWherePaginationQuery, SQLWhereQuery} from "./sql.query";

export interface SQLOrderBy {
    orderBy(): string;
    ascending(): boolean;
}

export interface SQLWhere {
    whereSql(): string;
    whereParams(): any[];
}

export class OkPacket {
    constructor(
        readonly fieldCount: number,
        readonly affectedRows: number,
        readonly insertId: number,
        readonly serverStatus: number,
        readonly warningCount: number,
        readonly message: string,
        readonly protocol41: number,
        readonly changedRows: number,
    ) {}

    static from(packet: any): OkPacket {
        return new OkPacket(
            packet['fieldCount'],
            packet['affectedRows'],
            packet['insertId'],
            packet['serverStatus'],
            packet['warningCount'],
            packet['message'],
            packet['protocol41'],
            packet['changedRows'],
        );
    }
}

export class RawMysqlDataSource implements GetDataSource<RawMysqlData>, PutDataSource<RawMysqlData>, DeleteDataSource {
    private tableColumns: string[] = [];

    constructor(
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

    mapError(error: Error) {
        if ('sqlMessage' in error && 'code' in error) {
            let sqlError = error as MysqlError;
            let message = `${sqlError.sqlMessage}`;
            if (sqlError.code === 'ER_DUP_ENTRY') {
                return new ForbiddenError(message);
            } else {
                return new FailedError(message);
            }
        } else {
            return error;
        }
    }

    async get(query: Query): Promise<RawMysqlData> {
        let columnsStr = this.idColumn;
        this.tableColumns.forEach(column => {
            columnsStr += `, ${column}`;
        });
        if (query instanceof IdQuery) {
            return this.sqlInterface
                .query(`select ${columnsStr} from ${this.tableName} where ${this.idColumn} = ?`, query.id)
                .then(rows => {
                    if (rows.length === 0) {
                        throw new NotFoundError();
                    } else {
                        return rows[0];
                    }
                })
                .catch(e => { throw this.mapError(e); });
        } else if (query instanceof SQLWhereQuery) {
            let orderLimitSQL = this.orderLimitSQL(0, 1, query.orderBy(), query.ascending());
            return this.sqlInterface
                .query(`select ${columnsStr} from ${this.tableName} where ${query.whereSql()} ${orderLimitSQL}`, query.whereParams())
                .then(rows => {
                    if (rows.length === 0) {
                        throw new NotFoundError();
                    } else {
                        return rows[0];
                    }
                })
                .catch(e => { throw this.mapError(e); });
        } else if (query instanceof SQLWherePaginationQuery) {
            let orderLimitSQL = this.orderLimitSQL(query.offset, query.limit, query.orderBy(), query.ascending());
            return this.sqlInterface
                .query(`select ${columnsStr} from ${this.tableName} where ${query.whereSql()} ${orderLimitSQL}`, query.whereParams())
                .then(rows => {
                    if (rows.length === 0) {
                        throw new NotFoundError();
                    } else {
                        return rows[0];
                    }
                })
                .catch(e => { throw this.mapError(e); });
        } else if (query instanceof SQLOrderByQuery) {
            let orderLimitSQL = this.orderLimitSQL(0, 1, query.orderBy(), query.ascending());
            return this.sqlInterface
                .query(`select ${columnsStr} from ${this.tableName} ${orderLimitSQL}`)
                .then(rows => {
                    if (rows.length === 0) {
                        throw new NotFoundError();
                    } else {
                        return rows[0];
                    }
                })
                .catch(e => { throw this.mapError(e); });
        } else if (query instanceof SQLOrderByPaginationQuery) {
            let orderLimitSQL = this.orderLimitSQL(query.offset, query.limit, query.orderBy(), query.ascending());
            return this.sqlInterface
                .query(`select ${columnsStr} from ${this.tableName} ${orderLimitSQL}`)
                .then(rows => {
                    if (rows.length === 0) {
                        throw new NotFoundError();
                    } else {
                        return rows[0];
                    }
                })
                .catch(e => { throw this.mapError(e); });
        } else if (query instanceof PaginationOffsetLimitQuery) {
            let orderLimitSQL = this.orderLimitSQL(query.offset, query.limit);
            return this.sqlInterface
                .query(`select ${columnsStr} from ${this.tableName} ${orderLimitSQL}`)
                .then(rows => {
                    if (rows.length === 0) {
                        throw new NotFoundError();
                    } else {
                        return rows[0];
                    }
                })
                .catch(e => {
                    throw this.mapError(e);
                });
        } else {
            throw new QueryNotSupportedError();
        }
    }

    protected orderLimitSQL(offset: number, limit: number, orderBy = this.createdAtColumn, ascending = true): string {
        return `order by ${orderBy} ${(ascending ? 'asc' : 'desc')} limit ${offset},${limit}`;
    }

    async getAll(query: Query): Promise<RawMysqlData[]> {
        let columnsStr = this.idColumn;
        this.tableColumns.forEach(column => {
            columnsStr += `, ${column}`;
        });

        if (query instanceof IdsQuery) {
            return this.sqlInterface.query(`select ${columnsStr} from ${this.tableName} where ${this.idColumn} in (?)`, query.ids);
        } else {
            if (query instanceof SQLWhereQuery) {
                let orderLimitSQL = this.orderLimitSQL(0, 10, query.orderBy(), query.ascending());
                return this.sqlInterface
                    .query(`select ${columnsStr} from ${this.tableName} where ${query.whereSql()} ${orderLimitSQL}`, query.whereParams())
                    .catch(e => { throw this.mapError(e); });
            } else if (query instanceof SQLWherePaginationQuery) {
                let orderLimitSQL = this.orderLimitSQL(query.offset, query.limit, query.orderBy(), query.ascending());
                return this.sqlInterface
                    .query(`select ${columnsStr} from ${this.tableName} where ${query.whereSql()} ${orderLimitSQL}`, query.whereParams())
                    .catch(e => { throw this.mapError(e); });
            } else if (query instanceof SQLOrderByQuery) {
                let orderLimitSQL = this.orderLimitSQL(0, 10, query.orderBy(), query.ascending());
                return this.sqlInterface
                    .query(`select ${columnsStr} from ${this.tableName} ${orderLimitSQL}`)
                    .catch(e => { throw this.mapError(e); });
            } else if (query instanceof SQLOrderByPaginationQuery) {
                let orderLimitSQL = this.orderLimitSQL(query.offset, query.limit, query.orderBy(), query.ascending());
                return this.sqlInterface
                    .query(`select ${columnsStr} from ${this.tableName} ${orderLimitSQL}`)
                    .catch(e => { throw this.mapError(e); });
            } else if (query instanceof PaginationOffsetLimitQuery) {
                let orderLimitSQL = this.orderLimitSQL(query.offset, query.limit);
                return this.sqlInterface
                    .query(`select ${columnsStr} from ${this.tableName} ${orderLimitSQL}`)
                    .catch(e => { throw this.mapError(e); });
            } else {
                let orderLimitSQL = this.orderLimitSQL(0, 10);
                return this.sqlInterface
                    .query(`select ${columnsStr} from ${this.tableName} ${orderLimitSQL}`)
                    .catch(e => { throw this.mapError(e); });
            }
        }
    }

    private getId(data: RawMysqlData, queryOrId: Query): number {
        let id = null;
        if (queryOrId instanceof IdQuery) {
            id = queryOrId.id;
        } else {
            id = data[BaseColumnId];
        }
        return id;
    }

    private updateSQLQuery(value: RawMysqlData): string {
        let paramList: any[] = [];
        this.tableColumns.forEach(column => {
            if (value[column] !== undefined) {
                paramList.push(`${column} = ?`);
            }
        });
        let params = paramList.join(',');
        return `update ${this.tableName} set ${params} where ${this.idColumn} = ?`;
    }

    private updateSQLParams(id: any, value: RawMysqlData): any[] {
        let params: any[] = [];
        this.tableColumns.forEach(column => {
            if (value[column] !== undefined) {
                params.push(value[column]);
            }
        });
        params.push(id);
        return params;
    }

    private insertSQLQuery(value: RawMysqlData): string {
        let paramList: any[] = [];
        let valueList: any[] = [];
        this.tableColumns.forEach((column, idx) => {
            if (value[column] !== undefined) {
                paramList.push(`${column}`);
                valueList.push('?');
            }
        });
        let params = `(${paramList.join(',')})`;
        let values = `(${valueList.join(',')})`;
        return `insert into ${this.tableName} ${params} values ${values}`;
    }

    private insertSQLQueryParams(value: RawMysqlData): any[] {
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

    async put(value: RawMysqlData, query: Query): Promise<RawMysqlData> {
        let id = this.getId(value, query);
        const isInsertion = !(id !== undefined && id !== null);
        return this.sqlInterface.transaction((sqlInterface: SQLInterface) => {
            return sqlInterface.query(
                isInsertion ? this.insertSQLQuery(value) : this.updateSQLQuery(value),
                isInsertion ? this.insertSQLQueryParams(value) : this.updateSQLParams(id, value),
            ).then(result => {
                // TODO: Fix this
                // When the insertion/update fails (for example, because of a unique constraint),
                // no error is generated and the result contains insertId = 0
                let rowId = id ? id : OkPacket.from(result).insertId;
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
        })
            .then(rowId => this.get(new IdQuery(rowId)))
            .catch(e => { throw this.mapError(e); });
    }

    async putAll(values: RawMysqlData[], query: Query): Promise<RawMysqlData[]> {
        if (query instanceof IdsQuery) {
            if (values.length !== query.ids.length) {
                // tslint:disable-next-line:max-line-length
                throw new InvalidArgumentError(`Error in PutAll: Length of ids (${query.ids.length}) doesn't match the array of values (${values.length})`);
            }
        }
        const insertionIds = this.sqlInterface.transaction((sqlInterface: SQLInterface) => {
            return Promise.all(values.map((value, idx) => {
                let id = value[BaseColumnId];
                if (!id && query instanceof IdsQuery) {
                    id = query.ids[idx];
                }
                const isInsertion = !(id !== undefined && id !== null);
                return sqlInterface.query(
                    (isInsertion) ? this.insertSQLQuery(value) : this.updateSQLQuery(value),
                    (isInsertion) ? this.insertSQLQueryParams(value) : this.updateSQLParams(id, value),
                ).then(result => {
                    // TODO: Fix this
                    // When the insertion/update fails (for example, because of a unique constraint),
                    // no error is generated and the result contains insertId = 0
                    let rowId = id ? id : OkPacket.from(result).insertId;
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
            }));
        });

        return insertionIds.then(array => {
            return Promise.all(array.map(id => this.get(new IdQuery(id))));
        }).catch(e => { throw this.mapError(e); });
    }

    async delete(query: Query): Promise<void> {
        if (query instanceof IdQuery) {
            return this.sqlInterface
                .query(`delete from ${this.tableName} where ${this.idColumn} = ?`, query.id)
                .then(() => Promise.resolve())
                .catch(e => { throw this.mapError(e); });
        }
        throw new QueryNotSupportedError();
    }

    async deleteAll(query: Query): Promise<void> {
        if (query instanceof IdsQuery) {
            // TODO: Double check this works
            return this.sqlInterface
                .query(`delete from ${this.tableName} where ${this.idColumn} in (?)`, query.ids)
                .then(() => Promise.resolve())
                .catch(e => { throw this.mapError(e); });
        } else if (query instanceof SQLWhereQuery) {
            return this.sqlInterface
                .query(`delete from ${this.tableName} where ${query.whereSql()}`, query.whereParams())
                .then(() => Promise.resolve())
                .catch(e => { throw this.mapError(e); });
        } else if (query instanceof SQLWherePaginationQuery) {
            return this.sqlInterface
                .query(`delete from ${this.tableName} where ${query.whereSql()}`, query.whereParams())
                .then(() => Promise.resolve())
                .catch(e => { throw this.mapError(e); });
        }
        throw new QueryNotSupportedError();
    }
}
