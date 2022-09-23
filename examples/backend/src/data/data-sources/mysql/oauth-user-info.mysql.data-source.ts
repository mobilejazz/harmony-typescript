import {
    BaseColumnId,
    GetDataSource,
    IdQuery,
    NotFoundError,
    Query,
    QueryNotSupportedError,
    RawSQLData,
    SQLDialect,
    SQLInterface,
} from '@mobilejazz/harmony-core';

import { OauthUserInfoEntity } from '../../entities/oauth-user-info.entity';
import {
    UserTableColumnPasswordHashAlgorithm,
    UserTableColumnPasswordSalt,
    UserTableColumnRoleId,
} from './database.constants';
import { UserEmailQuery } from '../../queries/user.query';
import { UserRole } from 'src/data/entities/user.entity';

export class OauthUserInfoMysqlDataSource
    implements GetDataSource<OauthUserInfoEntity>
{
    constructor(
        private readonly dialect: SQLDialect,
        private readonly db: SQLInterface,
    ) {}

    public async get(query: Query): Promise<OauthUserInfoEntity> {
        if (query instanceof IdQuery || query instanceof UserEmailQuery) {
            let sqlQuery =
                'select id, password_salt, password_hash_algorithm, role_id from user';
            let params = [];

            if (query instanceof IdQuery) {
                sqlQuery += ' where id = ? and deleted_at is null';
                params = [query.id];
            } else if (query instanceof UserEmailQuery) {
                sqlQuery += ' where email = ? and deleted_at is null';
                params = [query.email];
            }

            return this.db
                .query<RawSQLData[]>(sqlQuery, params)
                .catch((e) => {
                    throw this.dialect.mapError(e);
                })
                .then((rows) => {
                    if (rows.length === 0) {
                        throw new NotFoundError();
                    }
                    return new OauthUserInfoEntity(
                        rows[0][BaseColumnId] as number,
                        rows[0][UserTableColumnPasswordSalt] as string,
                        rows[0][UserTableColumnPasswordHashAlgorithm] as string,
                        rows[0][UserTableColumnRoleId] as UserRole,
                    );
                });
        } else {
            throw new QueryNotSupportedError();
        }
    }

    public async getAll(query: Query): Promise<OauthUserInfoEntity[]> {
        throw new QueryNotSupportedError();
    }
}
