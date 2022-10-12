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
            from[OAuthColumnId] as number,
            from[OAuthColumnCreatedAt] as Date,
            from[OAuthColumnUpdatedAt] as Date,
            from[OAuthClientColumnClientId] as string,
            from[OAuthClientColumnClientSecret] as string,
            from[OAuthClientColumnAccessTokenLifetime] as number,
            from[OAuthClientColumnRefreshTokenLifetime] as number,
        );
    }
}
