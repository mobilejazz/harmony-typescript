import {Mapper, RawSQLData} from '@mobilejazz/harmony-core';
import {OAuthTokenEntity} from '../../entity/oauth-token.entity';
import {
    OAuthColumnCreatedAt,
    OAuthColumnId, OAuthColumnUpdatedAt,
    OAuthTokenColumnAccessToken,
    OAuthTokenColumnAccessTokenExpiresAt, OAuthTokenColumnClientId,
    OAuthTokenColumnRefreshToken,
    OAuthTokenColumnRefreshTokenExpiresAt,
} from '../oauth.database-columns.constants';

export class OAuthTokenEntityToRawSqlMapper implements Mapper<OAuthTokenEntity, RawSQLData> {
    public map(from: OAuthTokenEntity): RawSQLData {
        return {
            [OAuthTokenColumnAccessToken]: from.accessToken,
            [OAuthTokenColumnAccessTokenExpiresAt]: from.accessTokenExpiresAt,
            [OAuthTokenColumnRefreshToken]: from.refreshToken,
            [OAuthTokenColumnRefreshTokenExpiresAt]: from.refreshTokenExpiresAt,
            [OAuthTokenColumnClientId]: from.clientId,
            [OAuthColumnId]: from.id,
            [OAuthColumnCreatedAt]: from.createdAt,
            [OAuthColumnUpdatedAt]: from.updatedAt,
        };
    }
}
