import {GetDataSource} from "../data-source";
import {SQLDialect, SQLInterface} from "../../../data";
import {QueryNotSupportedError} from "../../errors";
import {BaseColumnDeletedAt, Query, SQLWherePaginationQuery} from "../..";
import {SQLWhereQuery} from "./sql.query";

export class SQLRowCounterDataSource implements GetDataSource<number> {
    constructor(
        protected readonly sqlDialect: SQLDialect,
        protected readonly sqlInterface: SQLInterface,
        protected readonly tableName: string,
        protected readonly deleteAtColumn = BaseColumnDeletedAt,
        protected readonly softDeleteEnabled = false,
    ) {}

    protected selectSQL(): string {
        return `select count(*) from ${this.sqlDialect.getTableName(this.tableName)}`;
    }

    async get(query: Query): Promise<number> {
        if (query instanceof SQLWhereQuery || query instanceof SQLWherePaginationQuery) {
            let sql = `${this.selectSQL()} where ${query.whereSql(this.sqlDialect)}`;
            if (this.softDeleteEnabled) {
                sql = `${sql} and ${this.deleteAtColumn} is null`;
            }
            return this.sqlInterface
                .query(sql, query.whereParams())
                .then(result => Number(result[0][this.sqlDialect.getCountName()]))
                .catch(e => { throw this.sqlDialect.mapError(e); });
        } else {
            let sql = this.selectSQL();
            if (this.softDeleteEnabled) {
                sql = `where ${this.deleteAtColumn} is null`;
            }
            return this.sqlInterface
                .query(sql)
                .then(result => Number(result[0][this.sqlDialect.getCountName()]))
                .catch(e => { throw this.sqlDialect.mapError(e); });
        }
    }

    async getAll(query: Query): Promise<number[]> {
        throw new QueryNotSupportedError('Use SQLRowCounterDataSource with a get method, not getAll.');
    }
}
