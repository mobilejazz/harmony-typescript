import {SQLWhereQuery, SQLQueryParamFn} from '@mobilejazz/harmony-core';

export class OAuthAccessTokenQuery extends SQLWhereQuery {
    constructor(
        readonly accessToken: string,
    ) { super(); }
    where(param: SQLQueryParamFn): string {
        return `access_token = ${param(this.accessToken)}`;
    }
}
