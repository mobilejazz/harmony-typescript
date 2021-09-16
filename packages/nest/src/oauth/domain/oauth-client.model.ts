export class OAuthClientModel {
    constructor(
        readonly id: number | undefined,
        readonly createdAt: Date | undefined,
        readonly updatedAt: Date | undefined,
        readonly clientId: string,
        readonly clientSecret: string,
        readonly grants: string[],
        readonly accessTokenLifetime?: number,
        readonly refreshTokenLifetime?: number,
    ) {}
}
