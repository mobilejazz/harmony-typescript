import {PutInteractor} from '@mobilejazz/harmony-core';
import {OAuthTokenModel} from '../oauth-token.model';
import {OAuthUserInfoModel} from '../oauth-user-info.model';
import {OAuthClientModel} from '../oauth-client.model';

export class PutOAuthTokenInteractor {
    constructor(
        private readonly putToken: PutInteractor<OAuthTokenModel>,
        private readonly putUserInfo: PutInteractor<OAuthUserInfoModel>,
    ) {}
    async execute(
        accessToken: string,
        accessTokenExpiresAt: Date,
        refreshToken: string,
        refreshTokenExpiresAt: Date,
        clientId: string,
        userId?: string,
        scope?: string[],
    ): Promise<OAuthTokenModel> {
        // Configuring the client.
        const client = new OAuthClientModel(
            undefined,
            undefined,
            undefined,
            clientId,
            undefined,
            undefined,
        );
        // Creating the token
        const token = new OAuthTokenModel(
            undefined,
            undefined,
            undefined,
            accessToken,
            accessTokenExpiresAt,
            refreshToken,
            refreshTokenExpiresAt,
            client,
            scope,
        );
        // Storing the token
        const result = await this.putToken.execute(token);
        if (userId) {
            // If user id, storing the user info.
            await this.putUserInfo.execute(new OAuthUserInfoModel(
                undefined,
                undefined,
                undefined,
                result.id,
                userId,
            ));
        }
        // Returning the stored token
        return result;
    }
}
