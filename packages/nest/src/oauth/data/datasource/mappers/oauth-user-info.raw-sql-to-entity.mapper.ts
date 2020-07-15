import {Mapper, RawSQLData} from '@mobilejazz/harmony-core';
import {
    OAuthColumnCreatedAt,
    OAuthColumnId, OAuthColumnUpdatedAt, OAuthUserInfoColumnTokenId, OAuthUserInfoColumnUserId,
} from '../oauth.database-columns.constants';
import {OAuthUserInfoEntity} from '../../entity/oauth-user-info.entity';

export class OAuthUserInfoRawSqlToEntityMapper implements Mapper<RawSQLData, OAuthUserInfoEntity> {
    public map(from: RawSQLData): OAuthUserInfoEntity {
        return new OAuthUserInfoEntity(
            from[OAuthColumnId],
            from[OAuthColumnCreatedAt],
            from[OAuthColumnUpdatedAt],
            from[OAuthUserInfoColumnTokenId],
            from[OAuthUserInfoColumnUserId],
        );
    }
}
