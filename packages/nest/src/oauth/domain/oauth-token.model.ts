import { OAuthClientModel } from './oauth-client.model';

export class OAuthTokenModel {
    constructor(
        readonly id: number,
        readonly createdAt: Date,
        readonly updatedAt: Date,
        readonly accessToken: string,
        readonly accessTokenExpiresAt: Date,
        readonly refreshToken: string,
        readonly refreshTokenExpiresAt: Date,
        readonly client: OAuthClientModel,
        readonly scope: string[],
    ) {}
}
