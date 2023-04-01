import { InvalidArgumentError } from '../../errors';
import { BaseColumnId, IdsQuery, Query } from '../..';
import { SQLInterface } from '../../../data';
import { AbstractRawSQLDataSource, RawSQLData } from './abstract-raw-sql.data-source';

export class ArrayRawSQLDataSource extends AbstractRawSQLDataSource<RawSQLData[]> {
    public async get(query: Query): Promise<RawSQLData[]> {
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

    public async put(values: RawSQLData[] | undefined, query: Query): Promise<RawSQLData[]> {
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
        return this.get(new IdsQuery(insertionIds)).catch((e) => {
            throw this.sqlDialect.mapError(e);
        });
    }
}
