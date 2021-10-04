export class OAuthTokenScopeEntity {
    constructor(
        readonly id: number,
        readonly createdAt: Date,
        readonly updatedAt: Date,
        readonly scope: string,
        readonly tokenId: number,
    ) {}
}
