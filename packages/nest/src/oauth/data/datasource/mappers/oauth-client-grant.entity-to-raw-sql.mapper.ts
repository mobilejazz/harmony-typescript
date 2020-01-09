import {OAuthClientGrantEntity} from '../../entity/oauth-client-grant.entity';
import {Mapper, RawMysqlData} from '@mobilejazz/harmony-core';
import {
    OAuthClientGrantColumnClientId,
    OAuthClientGrantColumnGrantName,
    OAuthColumnCreatedAt,
    OAuthColumnId,
    OAuthColumnUpdatedAt,
} from '../oauth.database-columns.constants';

export class OAuthClientGrantEntityToRawSqlMapper implements Mapper<OAuthClientGrantEntity, RawMysqlData> {
    map(from: OAuthClientGrantEntity): RawMysqlData {
        let raw = {};
        raw[OAuthColumnId] = from.id;
        raw[OAuthColumnCreatedAt] = from.createdAt;
        raw[OAuthColumnUpdatedAt] = from.updatedAt;
        raw[OAuthClientGrantColumnGrantName] = from.grant;
        raw[OAuthClientGrantColumnClientId] = from.clientId;
        return raw;
    }
}
