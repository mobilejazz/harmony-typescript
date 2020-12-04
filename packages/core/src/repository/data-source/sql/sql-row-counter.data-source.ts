import {GetDataSource} from "../data-source";
import {SQLDialect, SQLInterface} from "../../../data";
import {QueryNotSupportedError} from "../../errors";
import {BaseColumnDeletedAt, Query, SQLQueryParamComposer, SQLWherePaginationQuery} from '../..';
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
            let sql = `${this.selectSQL()}`;

            let params = new SQLQueryParamComposer(this.sqlDialect);
            let queryWhereSQL = query.where(params.push, this.sqlDialect);
            let whereSql = queryWhereSQL ? queryWhereSQL : '';

            if (this.softDeleteEnabled) {
                if (whereSql.length > 0) {
                    whereSql += ' and ';
                }
                whereSql += `${this.deleteAtColumn} is null`;
            }

            if (whereSql.length > 0) {
                sql += ' where ' + whereSql;
            }

            if (sql.indexOf('count(*)') === -1) {
                sql = `select count(*) from (${sql}) as t`;
            }
            return this.sqlInterface
                .query(sql, params.getParams())
                .then(result => Number(result[0][this.sqlDialect.getCountName()]))
                .catch(e => { throw this.sqlDialect.mapError(e); });
        } else {
            let sql = this.selectSQL();
            if (this.softDeleteEnabled) {
                sql = `${sql} where ${this.deleteAtColumn} is null`;
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
