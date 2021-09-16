import { Mapper, RawSQLData } from '@mobilejazz/harmony-core';
import { OAuthClientEntity } from '../../entity/oauth-client.entity';
import {
    OAuthColumnCreatedAt,
    OAuthColumnId,
    OAuthColumnUpdatedAt,
    OAuthClientColumnAccessTokenLifetime,
    OAuthClientColumnClientId,
    OAuthClientColumnClientSecret,
    OAuthClientColumnRefreshTokenLifetime,
} from '../oauth.database-columns.constants';

export class OAuthClientRawSqlToEntityMapper implements Mapper<RawSQLData, OAuthClientEntity> {
    public map(from: RawSQLData): OAuthClientEntity {
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
