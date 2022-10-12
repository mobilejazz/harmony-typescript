import { Mapper } from '@mobilejazz/harmony-core';
import { OAuthUserInfoEntity } from '../../data/entity/oauth-user-info.entity';
import { OAuthUserInfoModel } from '../oauth-user-info.model';

export class OAuthUserInfoEntityToModelMapper implements Mapper<OAuthUserInfoEntity, OAuthUserInfoModel> {
    public map(from: OAuthUserInfoEntity): OAuthUserInfoModel {
        return new OAuthUserInfoModel(
            from.id as number,
            from.createdAt as Date,
            from.updatedAt as Date,
            from.tokenId,
            from.userId,
        );
    }
}
