import { OAuthUserInfoModel } from '../oauth-user-info.model';
import { GetInteractor } from '@mobilejazz/harmony-core';
import { OAuthAccessTokenQuery } from '../../data/datasource/query/oauth-access-token.query';
import { OAuthTokenModel } from '../oauth-token.model';
import { OAuthTokenIdQuery } from '../../data/datasource/query/oauth-token-id.query';

export class GetOAuthUserInfoInteractor {
    constructor(
        private readonly getToken: GetInteractor<OAuthTokenModel>,
        private readonly getUserInfo: GetInteractor<OAuthUserInfoModel>,
    ) {}
    async execute(accessToken: string): Promise<OAuthUserInfoModel> {
        const token = await this.getToken.execute(new OAuthAccessTokenQuery(accessToken));
        return this.getUserInfo.execute(new OAuthTokenIdQuery(token.id));
    }
}
