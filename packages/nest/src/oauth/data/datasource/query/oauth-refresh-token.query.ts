import {SQLWhereQuery, SQLQueryParamFn} from '@mobilejazz/harmony-core';

export class OAuthRefreshTokenQuery extends SQLWhereQuery {
    constructor(
        readonly refreshToken: string,
    ) { super(); }
    where(param: SQLQueryParamFn): string {
        return `refresh_token = ${param(this.refreshToken)}`;
    }
}
