import {SQLWhereQuery} from '@mobilejazz/harmony-core';

export class OAuthRefreshTokenQuery extends SQLWhereQuery {
    constructor(
        readonly refreshToken: string,
    ) { super(); }
    whereParams(): any[] {
        return [this.refreshToken];
    }
    whereSql(): string {
        return 'refresh_token = ?';
    }
}
