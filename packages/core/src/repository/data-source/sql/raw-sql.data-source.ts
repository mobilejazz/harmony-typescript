import { InvalidArgumentError, NotFoundError } from '../../errors';
import { IdQuery, Query } from '../..';
import { SQLInterface } from '../../../data';
import { AbstractRawSQLDataSource, RawSQLData } from './abstract-raw-sql.data-source';

export class RawSQLDataSource extends AbstractRawSQLDataSource<RawSQLData> {
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
}
