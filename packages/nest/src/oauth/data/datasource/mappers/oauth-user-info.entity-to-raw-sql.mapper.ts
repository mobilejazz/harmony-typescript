import {Mapper, RawSQLData} from '@mobilejazz/harmony-core';
import {
    OAuthColumnCreatedAt,
    OAuthColumnId, OAuthColumnUpdatedAt, OAuthUserInfoColumnTokenId, OAuthUserInfoColumnUserId,
} from '../oauth.database-columns.constants';
import {OAuthUserInfoEntity} from '../../entity/oauth-user-info.entity';

export class OAuthUserInfoEntityToRawSqlMapper implements Mapper<OAuthUserInfoEntity, RawSQLData> {
    public map(from: OAuthUserInfoEntity): RawSQLData {
        return {
            [OAuthColumnId]: from.id,
            [OAuthColumnCreatedAt]: from.createdAt,
            [OAuthColumnUpdatedAt]: from.updatedAt,
            [OAuthUserInfoColumnTokenId]: from.tokenId,
            [OAuthUserInfoColumnUserId]: from.userId,
        };
    }
}
