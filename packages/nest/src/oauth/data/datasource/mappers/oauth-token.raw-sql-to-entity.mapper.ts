import { Mapper, RawSQLData } from '@mobilejazz/harmony-core';

import { OAuthTokenEntity } from '../../entity/oauth-token.entity';
import {
    OAuthColumnCreatedAt,
    OAuthColumnId,
    OAuthColumnUpdatedAt,
    OAuthTokenColumnAccessToken,
    OAuthTokenColumnAccessTokenExpiresAt,
    OAuthTokenColumnClientId,
    OAuthTokenColumnRefreshToken,
    OAuthTokenColumnRefreshTokenExpiresAt,
} from '../oauth.database-columns.constants';

export class OAuthTokenRawSqlToEntityMapper implements Mapper<RawSQLData, OAuthTokenEntity> {
    public map(from: RawSQLData): OAuthTokenEntity {
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
