import { OAuthClient, ValidateScopeInteractor } from '@mobilejazz/harmony-nest';

import { OAuthUserInfoModel } from '../../models/oauth-user-info.model';

export enum TokenScope {
    APP = 'app',
    USER = 'user',
}

export const ClientWebApp = 'web-app';

export class ValidateUserScopeInteractor implements ValidateScopeInteractor {
    public async execute(
        user: OAuthUserInfoModel,
        client: OAuthClient,
        scope: string[],
    ): Promise<TokenScope[]> {
        if (client.id === ClientWebApp) {
            if (user.id) {
                return [TokenScope.USER, TokenScope.APP];
            } else {
                return [TokenScope.APP];
            }
        } else {
            return [];
        }
    }
}
