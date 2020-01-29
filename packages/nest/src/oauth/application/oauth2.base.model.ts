import {BaseModel, RequestAuthenticationModel, Client, Falsey, Token, User, ClientCredentialsModel} from 'oauth2-server';
import {GetOAuthClientInteractor} from '../domain/interactors/get-oauth-client.interactor';
import {PutOAuthTokenInteractor} from '../domain/interactors/put-oauth-token.interactor';
import {GetOAuthTokenInteractor} from '../domain/interactors/get-oauth-token.interactor';
import {GetOAuthUserInfoInteractor} from '../domain/interactors/get-oauth-user-info.interactor';
import {GetOAuthUserInteractor} from '../domain/interactors/get-oauth-user.interactor';
import {OAuthUserInfoModel} from '../domain/oauth-user-info.model';
import {OAuthUser} from '../domain/oauth-user.model';

export class OAuthClient implements Client {
    constructor(
        readonly id: string,
        readonly grants: string | string[],
        readonly redirectUris?: string | string[],
        readonly accessTokenLifetime?: number,
        readonly refreshTokenLifetime?: number,
    ) {}
}

export class OAuthToken implements Token {
    constructor(
        readonly accessToken: string,
        readonly accessTokenExpiresAt: Date,
        readonly refreshToken: string,
        readonly refreshTokenExpiresAt: Date,
        readonly scope: string | string[],
        readonly client: Client,
        readonly user: User,
    ) {}
}

export class OAuth2BaseModel implements BaseModel, RequestAuthenticationModel, ClientCredentialsModel {
    constructor(
        protected readonly getClientInteractor: GetOAuthClientInteractor,
        protected readonly putTokenInteractor: PutOAuthTokenInteractor,
        protected readonly getTokenInteractor: GetOAuthTokenInteractor,
        protected readonly getUserInfoInteractor?: GetOAuthUserInfoInteractor,
        protected readonly getUserInteractor?: GetOAuthUserInteractor,
    ) {}

    async getClient(
        clientId: string,
        clientSecret: string,
        callback?: (err?: any, result?: (Client | "" | 0 | false | null | undefined)) => void,
    ): Promise<Client | Falsey> {
        return this.getClientInteractor
            .execute(clientId, clientSecret)
            .then(client => {
                const oauthClient = new OAuthClient(
                    clientId,
                    client.grants,
                    undefined,
                    client.accessTokenLifetime,
                    client.refreshTokenLifetime,
                );
                if (callback) {
                    callback(null, oauthClient);
                }
                return oauthClient;
            }).catch(err => {
                if (callback) {
                    callback(err, null);
                }
                return null;
            });
    }

    async saveToken(
        token: Token,
        client: Client,
        user: OAuthUser,
        callback?: (err?: any, result?: Token) => void,
    ): Promise<Token | Falsey> {
        let scope: string[] = [];
        if (typeof token.scope === 'string') {
            scope = [token.scope as string];
        } else if (token.scope instanceof Array) {
            scope = token.scope;
        }
        await this.putTokenInteractor.execute(
            token.accessToken,
            token.accessTokenExpiresAt,
            token.refreshToken,
            token.refreshTokenExpiresAt,
            client.id,
            user.oauthId(), // <- can't enforce to implement OAuthUser
            scope,
        );
        token.client = client;
        token.user = user;
        if (callback) {
            callback(null, token);
        }
        return token;
    }

    async getAccessToken(
        accessToken: string,
        callback?: (err?: any, result?: Token) => void,
    ): Promise<Token | Falsey> {
        try {
            const token = await this.getTokenInteractor.execute(accessToken);

            let userInfo: OAuthUserInfoModel;
            let user: OAuthUser;
            try {
                if (this.getUserInfoInteractor) {
                    userInfo = await this.getUserInfoInteractor.execute(token.accessToken);
                }
                if (this.getUserInfoInteractor && userInfo.userId) {
                    user = await this.getUserInteractor.execute(userInfo.userId);
                }
            } catch (err) {
                // Nothing to do. There is just no associated user info or user model.
            }

            // @ts-ignore
            const final = new OAuthToken(
                token.accessToken,
                token.accessTokenExpiresAt,
                token.refreshToken,
                token.refreshTokenExpiresAt,
                token.scope,
                new OAuthClient(
                    token.client.clientId,
                    token.client.grants,
                    undefined,
                    token.client.accessTokenLifetime,
                    token.client.refreshTokenLifetime,
                ),
                user,
            );
            if (callback) {
                callback(null, final);
            }
            return final;
        } catch (err) {
            if (callback) {
                callback(err, undefined);
            }
            return null;
        }
    }

    async verifyScope(
        token: Token,
        scope: string | string[],
        callback?: (err?: any, result?: boolean) => void,
    ): Promise<boolean> {
        // console.log('WARNING: Scope Verification not implemented! Always returning true!');
        if (callback) {
            callback(null, true);
        }
        return true;
    }

    async getUserFromClient(
        client: Client,
        callback?: (err?: any, result?: (User | "" | 0 | false | null | undefined)) => void,
    ): Promise<User | Falsey> {
        // No user associated when using client_credentials
        if (callback) {
            callback(null, {});
        }
        return client;
    }

    // OPTIONAL METHODS
/*
    generateAccessToken(
        client: Client,
        user: User,
        scope: string | string[],
        callback?: (err?: any, result?: string) => void,
    ): Promise<string> {
        console.log('generateAccessToken.client: ', client);
        console.log('generateAccessToken.user: ', user);
        console.log('generateAccessToken.scope: ', scope);
        return undefined;
    }

    async validateScope(
        user: User,
        client: Client,
        scope: string | string[],
        callback?: (err?: any, result?: (string | "" | 0 | false | null | undefined)) => void,
    ): Promise<string | string[] | Falsey> {
        return undefined;
    }
 */
}
