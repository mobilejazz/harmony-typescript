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
        return {
            [OAuthClientColumnClientId]: from.clientId,
            [OAuthClientColumnClientSecret]: from.clientSecret,
            [OAuthClientColumnAccessTokenLifetime]: from.accessTokenLifetime,
            [OAuthClientColumnRefreshTokenLifetime]: from.refreshTokenLifetime,
            [OAuthColumnId]: from.id,
            [OAuthColumnCreatedAt]: from.createdAt,
            [OAuthColumnUpdatedAt]: from.updatedAt,
        };
    }
}
