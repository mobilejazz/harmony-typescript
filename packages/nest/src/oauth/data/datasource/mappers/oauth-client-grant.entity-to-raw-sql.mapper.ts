import {OAuthClientGrantEntity} from '../../entity/oauth-client-grant.entity';
import {Mapper, RawSQLData} from '@mobilejazz/harmony-core';
import {
    OAuthClientGrantColumnClientId,
    OAuthClientGrantColumnGrantName,
    OAuthColumnCreatedAt,
    OAuthColumnId,
    OAuthColumnUpdatedAt,
} from '../oauth.database-columns.constants';

export class OAuthClientGrantEntityToRawSqlMapper implements Mapper<OAuthClientGrantEntity, RawSQLData> {
    map(from: OAuthClientGrantEntity): RawSQLData {
        let raw = {};
        raw[OAuthColumnId] = from.id;
        raw[OAuthColumnCreatedAt] = from.createdAt;
        raw[OAuthColumnUpdatedAt] = from.updatedAt;
        raw[OAuthClientGrantColumnGrantName] = from.grant;
        raw[OAuthClientGrantColumnClientId] = from.clientId;
        return raw;
    }
}
