export class OAuthTokenScopeEntity {
    constructor(
        readonly id: number | undefined,
        readonly createdAt: Date | undefined,
        readonly updatedAt: Date | undefined,
        readonly scope: string,
        readonly tokenId: number,
    ) {}
}
