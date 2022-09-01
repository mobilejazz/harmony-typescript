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
            from[OAuthColumnId] as number,
            from[OAuthColumnCreatedAt] as Date,
            from[OAuthColumnUpdatedAt] as Date,
            from[OAuthTokenColumnAccessToken] as string,
            from[OAuthTokenColumnAccessTokenExpiresAt] as Date,
            from[OAuthTokenColumnRefreshToken] as string,
            from[OAuthTokenColumnRefreshTokenExpiresAt] as Date,
            from[OAuthTokenColumnClientId] as number,
        );
    }
}
