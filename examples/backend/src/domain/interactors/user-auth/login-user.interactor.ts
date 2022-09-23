import { GetInteractor } from '@mobilejazz/harmony-core';
import {
    CryptoUtils,
    LoginOAuthUserInteractor,
} from '@mobilejazz/harmony-nest';
import { UnauthorizedException } from '@nestjs/common';

import { OauthUserInfoModel } from '../../models/oauth-user-info.model';
import { UserEmailQuery } from '../../../data/queries/user.query';

export class LoginUserInteractor implements LoginOAuthUserInteractor {
    constructor(private readonly getUser: GetInteractor<OauthUserInfoModel>) {}

    public async execute(
        username: string,
        password: string,
    ): Promise<OauthUserInfoModel> {
        try {
            const email = username.toLowerCase();
            const user = await this.getUser.execute(new UserEmailQuery(email));

            return CryptoUtils.comparePasswordHash(
                password,
                user.passwordSalt,
            ).then((match) => {
                if (match) {
                    return user;
                } else {
                    throw new UnauthorizedException();
                }
            });
        } catch (err) {
            throw new UnauthorizedException();
        }
    }
}
