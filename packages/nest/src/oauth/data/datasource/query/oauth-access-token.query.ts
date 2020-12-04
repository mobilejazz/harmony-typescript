import {SQLWhereQuery, SQLQueryParamComposer} from '@mobilejazz/harmony-core';

export class OAuthAccessTokenQuery extends SQLWhereQuery {
    constructor(
        readonly accessToken: string,
    ) { super(); }
    whereSql(params: SQLQueryParamComposer): string {
        return `access_token = ${params.next(this.accessToken)}`;
    }
}
