import {Mapper, RawMysqlData} from '@mobilejazz/harmony-core';
import {OAuthClientEntity} from '../../entity/oauth-client.entity';
import {
    OAuthColumnCreatedAt,
    OAuthColumnId,
    OAuthColumnUpdatedAt,
    OAuthClientColumnAccessTokenLifetime,
    OAuthClientColumnClientId,
    OAuthClientColumnClientSecret,
    OAuthClientColumnRefreshTokenLifetime,
} from '../oauth.database-columns.constants';

export class OAuthClientRawSqlToEntityMapper implements Mapper<RawMysqlData, OAuthClientEntity> {
    public map(from: RawMysqlData): OAuthClientEntity {
        return new OAuthClientEntity(
            from[OAuthColumnId],
            from[OAuthColumnCreatedAt],
            from[OAuthColumnUpdatedAt],
            from[OAuthClientColumnClientId],
            from[OAuthClientColumnClientSecret],
            from[OAuthClientColumnAccessTokenLifetime],
            from[OAuthClientColumnRefreshTokenLifetime],
        );
    }
}
