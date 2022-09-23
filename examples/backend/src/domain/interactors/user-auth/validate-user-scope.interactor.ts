import { OAuthClient, ValidateScopeInteractor } from '@mobilejazz/harmony-nest';

import { OauthUserInfoModel } from '../../models/oauth-user-info.model';

export enum TokenScope {
    APP = 'app',
    USER = 'user',
}

export const ClientWebApp = 'web-app';

export class ValidateUserScopeInteractor implements ValidateScopeInteractor {
    public async execute(
        user: OauthUserInfoModel,
        client: OAuthClient,
        scope: string[],
    ): Promise<string[]> {
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
