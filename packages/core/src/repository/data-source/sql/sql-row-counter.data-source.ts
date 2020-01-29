import {GetDataSource} from "../data-source";
import {SQLDialect, SQLInterface} from "../../../data";
import {QueryNotSupportedError} from "../../errors";
import {Query} from "../..";
import {SQLWhereQuery} from "./sql.query";

export class SQLRowCounterDataSource implements GetDataSource<number> {
    constructor(
        protected readonly sqlDialect: SQLDialect,
        protected readonly sqlInterface: SQLInterface,
        protected readonly tableName: string,
    ) {}

    get(query: Query): Promise<number> {
        if (query instanceof SQLWhereQuery) {
            return this.sqlInterface
                .query(`select count(*) from ${this.tableName} where ${query.whereSql(this.sqlDialect)}`, query.whereParams())
                .then(result => Number(result[0]['count(*)']))
                .catch(e => { throw this.sqlDialect.mapError(e); });
        } else {
            return this.sqlInterface
                .query(`select count(*) from ${this.tableName}`)
                .then(result => Number(result[0]['count(*)']))
                .catch(e => { throw this.sqlDialect.mapError(e); });
        }
    }

    async getAll(query: Query): Promise<number[]> {
        throw new QueryNotSupportedError('Use SQLRowCounterDataSource with a get method, not getAll.');
    }
}
