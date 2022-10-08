import { Query } from '@mobilejazz/harmony-core';

export class SaveTokenQuery extends Query {
    constructor(
        public readonly clientId: string,
        public readonly accessToken: string,
        public readonly accessTokenExpiresAt?: Date,
        public readonly refreshToken?: string,
        public readonly refreshTokenExpiresAt?: Date,
        public readonly scope?: string[],
    ) {
        super();
    }

    public hasScope(): boolean {
        return this.scope !== undefined && this.scope !== null && this.scope.length > 0;
    }
}
