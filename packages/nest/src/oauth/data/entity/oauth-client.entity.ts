
export class OAuthClientEntity {
    constructor(
        readonly id: number,
        readonly createdAt: Date,
        readonly updatedAt: Date,
        readonly clientId: string,
        readonly clientSecret: string,
        readonly accessTokenLifetime?: number,
        readonly refreshTokenLifetime?: number,
    ) { }
}
