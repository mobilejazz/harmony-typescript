export class OAuthTokenEntity {
    constructor(
        readonly id: number,
        readonly createdAt: Date,
        readonly updatedAt: Date,
        readonly accessToken: string,
        readonly accessTokenExpiresAt: Date,
        readonly refreshToken: string,
        readonly refreshTokenExpiresAt: Date,
        readonly clientId: number,
    ) {}
}
