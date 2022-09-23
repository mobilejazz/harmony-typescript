import { Mapper } from '@mobilejazz/harmony-core';

import { OauthUserInfoEntity } from 'src/data/entities/oauth-user-info.entity';
import { UserEntity } from 'src/data/entities/user.entity';
import { OauthUserInfoModel } from '../models/oauth-user-info.model';
import { UserModel } from '../models/user.model';

export class OauthUserInfoEntityToModelMapper
  implements Mapper<OauthUserInfoEntity, OauthUserInfoModel>
{
  public map(from: OauthUserInfoEntity): OauthUserInfoModel {
    return new OauthUserInfoModel(
      from.id,
      from.passwordSalt,
      from.passwordHashAlgorithm,
      from.role,
    );
  }
}

export class UserEntityToModelMapper implements Mapper<UserEntity, UserModel> {
  public map(from: UserEntity): UserModel {
    return new UserModel(
      from.id,
      from.email,
      from.firstName,
      from.lastName,
      from.role,
    );
  }
}

export class UserModelToEntityMapper implements Mapper<UserModel, UserEntity> {
  public map(from: UserModel): UserEntity {
    return new UserEntity(
      from.id,
      undefined,
      undefined,
      from.email,
      from.firstName,
      from.lastName,
      from.role,
    );
  }
}
