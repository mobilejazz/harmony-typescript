export class OAuthUserInfoEntity {
    constructor(
        readonly id: number,
        readonly createdAt: Date,
        readonly updatedAt: Date,
        readonly tokenId: number,
        readonly userId: string,
    ) {}
}
