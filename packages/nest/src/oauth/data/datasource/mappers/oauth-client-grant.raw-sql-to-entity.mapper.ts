import { OAuthClientGrantEntity } from '../../entity/oauth-client-grant.entity';
import { Mapper, RawSQLData } from '@mobilejazz/harmony-core';
import {
    OAuthClientGrantColumnClientId,
    OAuthClientGrantColumnGrantName,
    OAuthColumnCreatedAt,
    OAuthColumnId,
    OAuthColumnUpdatedAt,
} from '../oauth.database-columns.constants';

export class OAuthClientGrantRawSqlToEntityMapper implements Mapper<RawSQLData, OAuthClientGrantEntity> {
    map(from: RawSQLData): OAuthClientGrantEntity {
        return new OAuthClientGrantEntity(
            from[OAuthColumnId] as number,
            from[OAuthColumnCreatedAt] as Date,
            from[OAuthColumnUpdatedAt] as Date,
            from[OAuthClientGrantColumnGrantName] as string,
            from[OAuthClientGrantColumnClientId] as number,
        );
    }
}
