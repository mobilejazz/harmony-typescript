import {Mapper, RawSQLData} from '@mobilejazz/harmony-core';
import {
    OAuthColumnCreatedAt,
    OAuthColumnId,
    OAuthColumnUpdatedAt, OAuthTokenScopeColumnScope, OAuthTokenScopeColumnTokenId,
} from '../oauth.database-columns.constants';
import {OAuthTokenScopeEntity} from '../../entity/oauth-token-scope.entity';

export class OAuthTokenScopeEntityToRawSqlMapper implements Mapper<OAuthTokenScopeEntity, RawSQLData> {
    map(from: OAuthTokenScopeEntity): RawSQLData {
        return {
            [OAuthColumnId]: from.id,
            [OAuthColumnCreatedAt]: from.createdAt,
            [OAuthColumnUpdatedAt]: from.updatedAt,
            [OAuthTokenScopeColumnScope]: from.scope,
            [OAuthTokenScopeColumnTokenId]: from.tokenId,
        };
    }
}
