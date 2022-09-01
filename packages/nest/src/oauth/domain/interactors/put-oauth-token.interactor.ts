import { PutInteractor } from '@mobilejazz/harmony-core';
import { OAuthTokenModel } from '../oauth-token.model';
import { OAuthUserInfoModel } from '../oauth-user-info.model';
import { SaveTokenQuery } from '../../data/queries/token.query';
import { CreateUserInfoQuery } from '../../data/queries/user-info.query';

export class PutOAuthTokenInteractor {
    constructor(
        private readonly putToken: PutInteractor<OAuthTokenModel>,
        private readonly putUserInfo: PutInteractor<OAuthUserInfoModel>,
    ) {}

    public async execute(
        clientId: string,
        accessToken: string,
        accessTokenExpiresAt?: Date,
        refreshToken?: string,
        refreshTokenExpiresAt?: Date,
        userId?: string,
        scope?: string[],
    ): Promise<OAuthTokenModel> {
        // Store the token
        const token = await this.putToken.execute(undefined, new SaveTokenQuery(
            clientId,
            accessToken,
            accessTokenExpiresAt,
            refreshToken,
            refreshTokenExpiresAt,
            scope,
        ));

        // If `userId`, store the relation
        if (userId) {
            await this.putUserInfo.execute(undefined, new CreateUserInfoQuery(token.id, userId));
        }

        return token;
    }
}
