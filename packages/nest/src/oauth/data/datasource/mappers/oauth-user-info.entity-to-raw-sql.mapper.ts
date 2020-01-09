import {Mapper, RawMysqlData} from '@mobilejazz/harmony-core';
import {
    OAuthColumnCreatedAt,
    OAuthColumnId, OAuthColumnUpdatedAt, OAuthUserInfoColumnTokenId, OAuthUserInfoColumnUserId,
} from '../oauth.database-columns.constants';
import {OAuthUserInfoEntity} from '../../entity/oauth-user-info.entity';

export class OAuthUserInfoEntityToRawSqlMapper implements Mapper<OAuthUserInfoEntity, RawMysqlData> {
    public map(from: OAuthUserInfoEntity): RawMysqlData {
        let raw = {};
        raw[OAuthColumnId] = from.id;
        raw[OAuthColumnCreatedAt] = from.createdAt;
        raw[OAuthColumnUpdatedAt] = from.updatedAt;
        raw[OAuthUserInfoColumnTokenId] = from.tokenId;
        raw[OAuthUserInfoColumnUserId] = from.userId;
        return raw;
    }
}
