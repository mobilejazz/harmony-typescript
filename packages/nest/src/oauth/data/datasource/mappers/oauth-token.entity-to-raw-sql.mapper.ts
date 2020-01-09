import {Mapper, RawMysqlData} from '@mobilejazz/harmony-core';
import {OAuthTokenEntity} from '../../entity/oauth-token.entity';
import {
    OAuthColumnCreatedAt,
    OAuthColumnId, OAuthColumnUpdatedAt,
    OAuthTokenColumnAccessToken,
    OAuthTokenColumnAccessTokenExpiresAt, OAuthTokenColumnClientId,
    OAuthTokenColumnRefreshToken,
    OAuthTokenColumnRefreshTokenExpiresAt,
} from '../oauth.database-columns.constants';

export class OAuthTokenEntityToRawSqlMapper implements Mapper<OAuthTokenEntity, RawMysqlData> {
    public map(from: OAuthTokenEntity): RawMysqlData {
        let raw = {};
        raw[OAuthTokenColumnAccessToken] = from.accessToken;
        raw[OAuthTokenColumnAccessTokenExpiresAt] = from.accessTokenExpiresAt;
        raw[OAuthTokenColumnRefreshToken] = from.refreshToken;
        raw[OAuthTokenColumnRefreshTokenExpiresAt] = from.refreshTokenExpiresAt;
        raw[OAuthTokenColumnClientId] = from.clientId;
        raw[OAuthColumnId] = from.id;
        raw[OAuthColumnCreatedAt] = from.createdAt;
        raw[OAuthColumnUpdatedAt] = from.updatedAt;
        return raw;
    }
}
