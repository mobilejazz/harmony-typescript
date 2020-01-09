import {OAuthUser} from '../oauth-user.model';
import {OAuthClient} from '../../application/oauth2.base.model';

export interface ValidateScopeInteractor {
    execute(user: OAuthUser, client: OAuthClient, scope: string[]): Promise<string[]>;
}

export class AlwaysValidScopeInteractor implements ValidateScopeInteractor {
    execute(user: OAuthUser, client: OAuthClient, scope: string[]): Promise<string[]> {
        return Promise.resolve(scope);
    }
}
