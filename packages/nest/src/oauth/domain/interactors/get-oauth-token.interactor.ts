import { GetInteractor } from '@mobilejazz/harmony-core';
import { OAuthAccessTokenQuery } from '../../data/datasource/query/oauth-access-token.query';
import { OAuthTokenModel } from '../oauth-token.model';

export class GetOAuthTokenInteractor {
    constructor(private readonly getToken: GetInteractor<OAuthTokenModel>) {}
    execute(accessToken: string): Promise<OAuthTokenModel> {
        return this.getToken.execute(new OAuthAccessTokenQuery(accessToken));
    }
}
