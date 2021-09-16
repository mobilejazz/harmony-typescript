import { Mapper } from '@mobilejazz/harmony-core';
import { OAuthUserInfoEntity } from '../../data/entity/oauth-user-info.entity';
import { OAuthUserInfoModel } from '../oauth-user-info.model';

export class OAuthUserInfoModelToEntityMapper implements Mapper<OAuthUserInfoModel, OAuthUserInfoEntity> {
    map(from: OAuthUserInfoModel): OAuthUserInfoEntity {
        return new OAuthUserInfoEntity(from.id, from.createdAt, from.updatedAt, from.tokenId, from.userId);
    }
}
