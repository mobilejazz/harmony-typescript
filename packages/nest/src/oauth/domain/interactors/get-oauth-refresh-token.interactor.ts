import { OAuthTokenModel } from '../oauth-token.model';
import { GetInteractor } from '@mobilejazz/harmony-core';
import { OAuthRefreshTokenQuery } from '../../data/datasource/query/oauth-refresh-token.query';

export class GetOAuthRefreshTokenInteractor {
    constructor(private readonly getToken: GetInteractor<OAuthTokenModel>) {}
    execute(refreshToken: string): Promise<OAuthTokenModel> {
        return this.getToken.execute(new OAuthRefreshTokenQuery(refreshToken));
    }
}
