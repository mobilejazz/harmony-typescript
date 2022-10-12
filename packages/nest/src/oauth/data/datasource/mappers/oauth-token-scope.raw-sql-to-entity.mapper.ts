import { Mapper, RawSQLData } from '@mobilejazz/harmony-core';
import {
    OAuthColumnCreatedAt,
    OAuthColumnId,
    OAuthColumnUpdatedAt,
    OAuthTokenScopeColumnScope,
    OAuthTokenScopeColumnTokenId,
} from '../oauth.database-columns.constants';
import { OAuthTokenScopeEntity } from '../../entity/oauth-token-scope.entity';

export class OAuthTokenScopeRawSqlToEntityMapper implements Mapper<RawSQLData, OAuthTokenScopeEntity> {
    map(from: RawSQLData): OAuthTokenScopeEntity {
        return new OAuthTokenScopeEntity(
            from[OAuthColumnId] as number,
            from[OAuthColumnCreatedAt] as Date,
            from[OAuthColumnUpdatedAt] as Date,
            from[OAuthTokenScopeColumnScope] as string,
            from[OAuthTokenScopeColumnTokenId] as number,
        );
    }
}
