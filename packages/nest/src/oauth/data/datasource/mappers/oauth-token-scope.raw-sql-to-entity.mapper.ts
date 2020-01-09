import {Mapper, RawMysqlData} from '@mobilejazz/harmony-core';
import {
    OAuthColumnCreatedAt,
    OAuthColumnId,
    OAuthColumnUpdatedAt, OAuthTokenScopeColumnScope, OAuthTokenScopeColumnTokenId,
} from '../oauth.database-columns.constants';
import {OAuthTokenScopeEntity} from '../../entity/oauth-token-scope.entity';

export class OAuthTokenScopeRawSqlToEntityMapper implements Mapper<RawMysqlData, OAuthTokenScopeEntity> {
    map(from: RawMysqlData): OAuthTokenScopeEntity {
        return new OAuthTokenScopeEntity(
            from[OAuthColumnId],
            from[OAuthColumnCreatedAt],
            from[OAuthColumnUpdatedAt],
            from[OAuthTokenScopeColumnScope],
            from[OAuthTokenScopeColumnTokenId],
        );
    }
}
