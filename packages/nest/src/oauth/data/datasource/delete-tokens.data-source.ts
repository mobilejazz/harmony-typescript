import {
    DeleteDataSource,
    Query,
    QueryNotSupportedError,
    SQLDialect,
    SQLInterface,
} from "@mobilejazz/harmony-core";
import {
    OAuthClientColumnClientId,
    OAuthClientTableName,
    OAuthColumnId,
    OAuthTokenColumnClientId,
    OAuthTokenTableName,
    OAuthUserInfoColumnTokenId,
    OAuthUserInfoColumnUserId,
    OAuthUserInfoTableName,
} from "./oauth.database-columns.constants";
import {OAuthClientIdQuery} from "./query/oauth-client-id.query";
import {OAuthUserIdQuery} from "./query/oauth-user-id.query";

export class DeleteTokensDataSource implements DeleteDataSource {
    constructor(
        private readonly sqlDialect: SQLDialect,
        private readonly sqlInterface: SQLInterface,
    ) {}

    async delete(query: Query): Promise<void> {
        throw new QueryNotSupportedError('Use deleteAll on DeleteUserTokensDataSource');
    }

    deleteAll(query: Query): Promise<void> {
        if (query instanceof OAuthUserIdQuery) {
            const sqlQuery = `
                delete from ${this.sqlDialect.getTableName(OAuthTokenTableName)} t
                where t.${OAuthColumnId} in (
                        select i.${OAuthUserInfoColumnTokenId} from ${this.sqlDialect.getTableName(OAuthUserInfoTableName)} i
                        where i.${OAuthUserInfoColumnUserId} = ${this.sqlDialect.getParameterSymbol(1)}
                        );`;
            const params = [query.userId];
            return this.sqlInterface.query(sqlQuery, params);
        } else if (query instanceof OAuthClientIdQuery) {
            const sqlQuery = `
                delete from ${this.sqlDialect.getTableName(OAuthTokenTableName)} t
                where t.${OAuthTokenColumnClientId} in (
                        select i.${OAuthColumnId} from ${this.sqlDialect.getTableName(OAuthClientTableName)} i
                        where i.${OAuthClientColumnClientId} = ${this.sqlDialect.getParameterSymbol(1)}
                        );`;
            const params = [query.clientId];
            return this.sqlInterface.query(sqlQuery, params);
        } else {
            throw new QueryNotSupportedError('Use UserIdQuery or OAuthClientIdQuery on DeleteUserTokensDataSource.DeleteAll');
        }
    }
}
