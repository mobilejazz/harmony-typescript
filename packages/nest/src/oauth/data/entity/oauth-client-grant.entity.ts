export class OAuthClientGrantEntity {
    constructor(
        readonly id: number,
        readonly createdAt: Date,
        readonly updatedAt: Date,
        readonly grant: string,
        readonly clientId: number,
    ) {}
}
