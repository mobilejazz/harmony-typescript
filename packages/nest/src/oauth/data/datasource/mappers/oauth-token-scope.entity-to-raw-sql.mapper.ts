import {Mapper, RawMysqlData} from '@mobilejazz/harmony-core';
import {
    OAuthColumnCreatedAt,
    OAuthColumnId,
    OAuthColumnUpdatedAt, OAuthTokenScopeColumnScope, OAuthTokenScopeColumnTokenId,
} from '../oauth.database-columns.constants';
import {OAuthTokenScopeEntity} from '../../entity/oauth-token-scope.entity';

export class OAuthTokenScopeEntityToRawSqlMapper implements Mapper<OAuthTokenScopeEntity, RawMysqlData> {
    map(from: OAuthTokenScopeEntity): RawMysqlData {
        let raw = {};
        raw[OAuthColumnId] = from.id;
        raw[OAuthColumnCreatedAt] = from.createdAt;
        raw[OAuthColumnUpdatedAt] = from.updatedAt;
        raw[OAuthTokenScopeColumnScope] = from.scope;
        raw[OAuthTokenScopeColumnTokenId] = from.tokenId;
        return raw;
    }
}
