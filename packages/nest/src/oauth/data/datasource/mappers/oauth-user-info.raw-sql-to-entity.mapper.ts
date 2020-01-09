import {Mapper, RawMysqlData} from '@mobilejazz/harmony-core';
import {
    OAuthColumnCreatedAt,
    OAuthColumnId, OAuthColumnUpdatedAt, OAuthUserInfoColumnTokenId, OAuthUserInfoColumnUserId,
} from '../oauth.database-columns.constants';
import {OAuthUserInfoEntity} from '../../entity/oauth-user-info.entity';

export class OAuthUserInfoRawSqlToEntityMapper implements Mapper<RawMysqlData, OAuthUserInfoEntity> {
    public map(from: RawMysqlData): OAuthUserInfoEntity {
        return new OAuthUserInfoEntity(
            from[OAuthColumnId],
            from[OAuthColumnCreatedAt],
            from[OAuthColumnUpdatedAt],
            from[OAuthUserInfoColumnTokenId],
            from[OAuthUserInfoColumnUserId],
        );
    }
}
