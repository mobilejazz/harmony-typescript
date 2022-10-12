export class OAuthClientModel {
    constructor(
        readonly id: number,
        readonly createdAt: Date,
        readonly updatedAt: Date,
        readonly clientId: string,
        readonly clientSecret: string,
        readonly grants: string[],
        readonly accessTokenLifetime?: number,
        readonly refreshTokenLifetime?: number,
    ) {}
}
