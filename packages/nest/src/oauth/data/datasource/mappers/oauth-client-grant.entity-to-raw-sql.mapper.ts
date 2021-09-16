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
        return {
            [OAuthColumnId]: from.id,
            [OAuthColumnCreatedAt]: from.createdAt,
            [OAuthColumnUpdatedAt]: from.updatedAt,
            [OAuthClientGrantColumnGrantName]: from.grant,
            [OAuthClientGrantColumnClientId]: from.clientId,
        };
    }
}
