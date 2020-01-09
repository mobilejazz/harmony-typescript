import {GetDataSource} from "../data-source";
import {SQLInterface} from "../../../data";
import {FailedError, QueryNotSupportedError} from "../../errors";
import {Query} from "../..";
import {MysqlError} from 'mysql';
import {SQLWhereQuery} from "./sql.query";

export class MysqlRowCounterDataSource implements GetDataSource<number> {
    constructor(
        protected readonly sqlInterface: SQLInterface,
        protected readonly tableName: string,
    ) {}

    mapError(error: MysqlError) {
        return new FailedError(`${error.sqlMessage}`);
    }

    get(query: Query): Promise<number> {
        if (query instanceof SQLWhereQuery) {
            return this.sqlInterface
                .query(`select count(*) from ${this.tableName} where ${query.whereSql()}`, query.whereParams())
                .then(result => Number(result[0]['count(*)']))
                .catch(e => { throw this.mapError(e); });
        } else {
            return this.sqlInterface
                .query(`select count(*) from ${this.tableName}`)
                .then(result => Number(result[0]['count(*)']))
                .catch(e => { throw this.mapError(e); });
        }
    }

    async getAll(query: Query): Promise<number[]> {
        throw new QueryNotSupportedError('Use MysqlRowCounterDataSource with a get method, not getAll.');
    }
}
