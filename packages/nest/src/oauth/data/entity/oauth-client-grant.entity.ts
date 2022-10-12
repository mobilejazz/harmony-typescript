export class OAuthClientGrantEntity {
    constructor(
        readonly id: number | undefined,
        readonly createdAt: Date | undefined,
        readonly updatedAt: Date | undefined,
        readonly grant: string,
        readonly clientId: number,
    ) {}
}
