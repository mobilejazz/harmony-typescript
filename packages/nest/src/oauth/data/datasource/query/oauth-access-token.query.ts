import {SQLWhereQuery} from '@mobilejazz/harmony-core';

export class OAuthAccessTokenQuery extends SQLWhereQuery {
    constructor(
        readonly accessToken: string,
    ) { super(); }
    whereParams(): any[] {
        return [this.accessToken];
    }
    whereSql(): string {
        return 'access_token = ?';
    }
}
