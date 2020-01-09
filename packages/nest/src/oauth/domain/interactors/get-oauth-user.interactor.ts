import {OAuthUser} from '../oauth-user.model';

export interface GetOAuthUserInteractor {
    execute(userId: string): Promise<OAuthUser>;
}
