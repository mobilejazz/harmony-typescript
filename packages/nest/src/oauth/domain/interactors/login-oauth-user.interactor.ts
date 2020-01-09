import {OAuthUser} from '../oauth-user.model';

export interface LoginOAuthUserInteractor {
    execute(username: string, password: string): Promise<OAuthUser>;
}
