export class OAuthUserInfoEntity {
    constructor(
        readonly id: number | undefined,
        readonly createdAt: Date | undefined,
        readonly updatedAt: Date | undefined,
        readonly tokenId: number,
        readonly userId: string,
    ) {}
}
