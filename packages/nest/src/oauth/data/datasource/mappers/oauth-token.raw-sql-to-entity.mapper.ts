import {Mapper, RawMysqlData} from '@mobilejazz/harmony-core';

import {OAuthTokenEntity} from '../../entity/oauth-token.entity';
import {
    OAuthColumnCreatedAt, OAuthColumnId, OAuthColumnUpdatedAt,
    OAuthTokenColumnAccessToken,
    OAuthTokenColumnAccessTokenExpiresAt, OAuthTokenColumnClientId,
    OAuthTokenColumnRefreshToken, OAuthTokenColumnRefreshTokenExpiresAt,
} from '../oauth.database-columns.constants';

export class OAuthTokenRawSqlToEntityMapper implements Mapper<RawMysqlData, OAuthTokenEntity> {
    public map(from: RawMysqlData): OAuthTokenEntity {
        return new OAuthTokenEntity(
            from[OAuthColumnId],
            from[OAuthColumnCreatedAt],
            from[OAuthColumnUpdatedAt],
            from[OAuthTokenColumnAccessToken],
            from[OAuthTokenColumnAccessTokenExpiresAt],
            from[OAuthTokenColumnRefreshToken],
            from[OAuthTokenColumnRefreshTokenExpiresAt],
            from[OAuthTokenColumnClientId],
        );
    }
}
