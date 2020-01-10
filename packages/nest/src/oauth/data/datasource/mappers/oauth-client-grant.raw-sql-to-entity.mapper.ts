import {OAuthClientGrantEntity} from '../../entity/oauth-client-grant.entity';
import {Mapper, RawMysqlData} from '@mobilejazz/harmony-core';
import {
    OAuthClientGrantColumnClientId,
    OAuthClientGrantColumnGrantName,
    OAuthColumnCreatedAt,
    OAuthColumnId,
    OAuthColumnUpdatedAt,
} from '../oauth.database-columns.constants';

export class OAuthClientGrantRawSqlToEntityMapper implements Mapper<RawMysqlData, OAuthClientGrantEntity> {
    map(from: RawMysqlData): OAuthClientGrantEntity {
        return new OAuthClientGrantEntity(
            from[OAuthColumnId],
            from[OAuthColumnCreatedAt],
            from[OAuthColumnUpdatedAt],
            from[OAuthClientGrantColumnGrantName],
            from[OAuthClientGrantColumnClientId],
        );
    }
}
