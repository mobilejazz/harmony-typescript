import {OAuth2BaseModel, OAuthClient} from './oauth2.base.model';
import {Client, Falsey, PasswordModel, RefreshToken, RefreshTokenModel, Token, User} from 'oauth2-server';
import {GetOAuthClientInteractor} from '../domain/interactors/get-oauth-client.interactor';
import {PutOAuthTokenInteractor} from '../domain/interactors/put-oauth-token.interactor';
import {GetOAuthTokenInteractor} from '../domain/interactors/get-oauth-token.interactor';
import {GetOAuthUserInfoInteractor} from '../domain/interactors/get-oauth-user-info.interactor';
import {LoginOAuthUserInteractor} from '../domain/interactors/login-oauth-user.interactor';
import {GetOAuthUserInteractor} from '../domain/interactors/get-oauth-user.interactor';
import {GetOAuthRefreshTokenInteractor} from '../domain/interactors/get-oauth-refresh-token.interactor';
import {DeleteOAuthTokenInteractor} from '../domain/interactors/delete-oauth-token.interactor';
import {ValidateScopeInteractor} from '../domain/interactors/validate-scope.interactor';
import {ForbiddenException} from '@nestjs/common';

class OAuthRefreshToken implements RefreshToken {
    constructor(
        readonly client: Client,
        readonly refreshToken: string,
        readonly refreshTokenExpiresAt: Date,
        readonly scope: string | string[],
        readonly user: User,
    ) {}
}

export class OAuth2UserModel extends OAuth2BaseModel implements PasswordModel, RefreshTokenModel {
    constructor(
        getClientInteractor: GetOAuthClientInteractor,
        putTokenInteractor: PutOAuthTokenInteractor,
        getTokenInteractor: GetOAuthTokenInteractor,
        getUserInfoInteractor: GetOAuthUserInfoInteractor,
        getUserInteractor: GetOAuthUserInteractor,
        protected readonly loginUserInteractor: LoginOAuthUserInteractor,
        protected readonly getRefreshTokenInteractor: GetOAuthRefreshTokenInteractor,
        protected readonly deleteTokenInteractor: DeleteOAuthTokenInteractor,
        protected readonly validateScopeInteractor: ValidateScopeInteractor,
    ) {
        super(
            getClientInteractor,
            putTokenInteractor,
            getTokenInteractor,
            getUserInfoInteractor,
            getUserInteractor,
        );
    }

    async getUser(
        username: string,
        password: string,
        callback?: (err?: any, result?: (User | "" | 0 | false | null | undefined)) => void,
    ): Promise<User | Falsey> {
        try {
            const user = await this.loginUserInteractor.execute(username, password);
            if (callback) {
                callback(null, user);
            }
            return user;
        } catch (err) {
            if (callback) {
                callback(err, null);
            }
            return null;
        }
    }

    async getRefreshToken(
        refreshToken: string,
        callback?: (err?: any, result?: RefreshToken) => void,
    ): Promise<RefreshToken | Falsey> {
        try {
            const token = await this.getRefreshTokenInteractor.execute(refreshToken);
            const userInfo = await this.getUserInfoInteractor.execute(token.accessToken);
            const user = await this.getUserInteractor.execute(userInfo.userId);
            const final = new OAuthRefreshToken(
                new OAuthClient(
                    token.client.clientId,
                    token.client.grants,
                    undefined,
                    token.client.accessTokenLifetime,
                    token.client.refreshTokenLifetime,
                ),
                token.refreshToken,
                token.refreshTokenExpiresAt,
                token.scope,
                user,
            );
            if (callback) {
                callback(null, final);
            }
            return final;
        } catch (err) {
            if (callback) {
                callback(new ForbiddenException('Invalid refresh token'), undefined);
            }
            return null;
        }
    }

    async revokeToken(
        token: RefreshToken | Token,
        callback?: (err?: any, result?: boolean) => void,
    ): Promise<boolean> {
        let accessToken;
        if ('accessToken' in token) {
            accessToken = token['accessToken'];
        }
        const refreshToken = token.refreshToken;
        await this.deleteTokenInteractor.execute(accessToken, refreshToken);
        if (callback) {
            callback(null, true);
        }
        return true;
    }
/*
    getUserFromClient(
        client: Client,
        callback?: (err?: any, result?: (User | "" | 0 | false | null | undefined)) => void,
    ): Promise<User | Falsey> {
        console.log('getUserFromClient.client: ', client);
        return undefined;
    }
 */

    // OPTIONAL METHODS
/*
    generateRefreshToken(
        client: Client,
        user: User, scope: string | string[],
        callback?: (err?: any, result?: string) => void,
    ): Promise<string> {
        return undefined;
    }
*/
    async validateScope(
        user: User,
        client: Client,
        scope: string | string[],
        callback?: (err?: any, result?: (string | "" | 0 | false | null | undefined)) => void,
    ): Promise<string | string[] | Falsey> {
        try {
            let array: string[];
            if (!scope) {
                array = [];
            } else if (typeof scope === 'string') {
                array = [scope as string];
            } else  { // if (scope instanceof Array) { // or also can be undefined
                array = scope;
            }
            const result = await this.validateScopeInteractor.execute(user as any, client, array);
            if (callback) {
                callback(null, result as any);
            }
            return result;
        } catch (err) {
            if (callback) {
                callback(err, null);
            }
            return null;
        }
    }
}
