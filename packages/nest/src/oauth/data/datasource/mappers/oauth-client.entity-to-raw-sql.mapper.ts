import {Mapper, RawSQLData} from '@mobilejazz/harmony-core';
import {OAuthClientEntity} from '../../entity/oauth-client.entity';
import {
    OAuthClientColumnAccessTokenLifetime,
    OAuthClientColumnClientId,
    OAuthClientColumnClientSecret,
    OAuthClientColumnRefreshTokenLifetime, OAuthColumnCreatedAt, OAuthColumnId, OAuthColumnUpdatedAt,
} from '../oauth.database-columns.constants';

export class OAuthClientEntityToRawSqlMapper implements Mapper<OAuthClientEntity, RawSQLData> {
    public map(from: OAuthClientEntity): RawSQLData {
        let raw = {};
        raw[OAuthClientColumnClientId] = from.clientId;
        raw[OAuthClientColumnClientSecret] = from.clientSecret;
        raw[OAuthClientColumnAccessTokenLifetime] = from.accessTokenLifetime;
        raw[OAuthClientColumnRefreshTokenLifetime] = from.refreshTokenLifetime;
        raw[OAuthColumnId] = from.id;
        raw[OAuthColumnCreatedAt] = from.createdAt;
        raw[OAuthColumnUpdatedAt] = from.updatedAt;
        return raw;
    }
}
