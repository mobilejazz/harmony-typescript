export class OAuthTokenEntity {
    constructor(
        readonly id: number | undefined,
        readonly createdAt: Date | undefined,
        readonly updatedAt: Date | undefined,
        readonly accessToken: string,
        readonly accessTokenExpiresAt: Date | undefined,
        readonly refreshToken: string | undefined,
        readonly refreshTokenExpiresAt: Date | undefined,
        readonly clientId: number,
    ) {}
}
