import {Mapper} from '@mobilejazz/harmony-core';
import {OAuthUserInfoEntity} from '../../data/entity/oauth-user-info.entity';
import {OAuthUserInfoModel} from '../oauth-user-info.model';

export class OAuthUserInfoEntityToModelMapper implements Mapper<OAuthUserInfoEntity, OAuthUserInfoModel> {
    map(from: OAuthUserInfoEntity): OAuthUserInfoModel {
        return new OAuthUserInfoModel(
            from.id,
            from.createdAt,
            from.updatedAt,
            from.tokenId,
            from.userId,
        );
    }
}
