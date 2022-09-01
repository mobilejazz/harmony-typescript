import { Client, Falsey, Token, User, ClientCredentialsModel, Callback } from 'oauth2-server';
import { GetOAuthClientInteractor } from '../domain/interactors/get-oauth-client.interactor';
import { PutOAuthTokenInteractor } from '../domain/interactors/put-oauth-token.interactor';
import { GetOAuthTokenInteractor } from '../domain/interactors/get-oauth-token.interactor';
import { GetOAuthUserInfoInteractor } from '../domain/interactors/get-oauth-user-info.interactor';
import { GetOAuthUserInteractor } from '../domain/interactors/get-oauth-user.interactor';
import { OAuthUser } from '../domain/oauth-user.model';

export class OAuthClient implements Client {
    constructor(
        readonly id: string,
        readonly grants: string | string[],
        readonly redirectUris?: string | string[],
        readonly accessTokenLifetime?: number,
        readonly refreshTokenLifetime?: number,
        readonly data?: Record<string, unknown>,
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
        readonly data?: Record<string, unknown>,
    ) {}
}

export class OAuth2BaseModel implements ClientCredentialsModel {
    constructor(
        protected readonly getClientInteractor: GetOAuthClientInteractor,
        protected readonly putTokenInteractor: PutOAuthTokenInteractor,
        protected readonly getTokenInteractor: GetOAuthTokenInteractor,
        protected readonly getUserInfoInteractor?: GetOAuthUserInfoInteractor,
        protected readonly getUserInteractor?: GetOAuthUserInteractor,
    ) {}

    public async getClient(
        clientId: string,
        clientSecret: string,
        callback?: Callback<Client | Falsey>,
    ): Promise<Client | Falsey> {
        return this.getClientInteractor
            .execute(clientId, clientSecret)
            .then((client) => {
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
            })
            .catch((err) => {
                if (callback) {
                    callback(err, null);
                }

                return null;
            });
    }

    public async saveToken(
        token: Token,
        client: Client,
        user: OAuthUser,
        callback?: Callback<Token>,
    ): Promise<Token | Falsey> {
        let scope: string[] = [];
        let userId: string | undefined;

        if (typeof token.scope === 'string') {
            scope = [token.scope as string];
        } else if (Array.isArray(token.scope)) {
            scope = token.scope;
        }

        if (typeof user.oauthId === 'function') {
            // Can't enforce to implement OAuthUser,
            // Also, user can be undefined if doing a client_credentials grant type
            userId = user.oauthId();
        }

        await this.putTokenInteractor.execute(
            client.id,
            token.accessToken,
            token.accessTokenExpiresAt,
            token.refreshToken,
            token.refreshTokenExpiresAt,
            userId,
            scope,
        );

        token.client = client;
        token.user = user;

        if (callback) {
            callback(null, token);
        }

        return token;
    }

    public async getAccessToken(accessToken: string, callback?: Callback<Token>): Promise<Token | Falsey> {
        try {
            const token = await this.getTokenInteractor.execute(accessToken);

            let user = {}; // <-- a user must be defined anyway, otherwise the OAuth2Server will fail

            try {
                if (this.getUserInfoInteractor) {
                    const userInfo = await this.getUserInfoInteractor.execute(token.accessToken);

                    if (this.getUserInteractor && userInfo.userId) {
                        user = await this.getUserInteractor.execute(userInfo.userId);
                    }
                }
            } catch (err) {
                // Nothing to do. There is just no associated user info or user model.
            }

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

    public async verifyScope(
        token: Token,
        scope: string | string[],
        callback?: Callback<boolean>,
    ): Promise<boolean> {
        // console.log('WARNING: Scope Verification not implemented! Always returning true!');
        if (callback) {
            callback(null, true);
        }

        return true;
    }

    public async getUserFromClient(
        client: Client,
        callback?: Callback<User | Falsey>,
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
