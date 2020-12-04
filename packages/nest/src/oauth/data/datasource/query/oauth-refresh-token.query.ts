import {SQLWhereQuery, SQLQueryParamComposer} from '@mobilejazz/harmony-core';

export class OAuthRefreshTokenQuery extends SQLWhereQuery {
    constructor(
        readonly refreshToken: string,
    ) { super(); }
    whereSql(params: SQLQueryParamComposer): string {
        return `refresh_token = ${params.next(this.refreshToken)}`;
    }
}
