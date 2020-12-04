import {SQLWhereQuery, SQLQueryParamComposer} from '@mobilejazz/harmony-core';

export class OAuthClientQuery extends SQLWhereQuery {
    constructor(
        readonly clientId: string,
        readonly clientSecret: string,
    ) { super(); }
    whereSql(params: SQLQueryParamComposer): string {
        return `client_id = ${params.next(this.clientId)} and client_secret = ${params.next(this.clientSecret)}`;
    }
}
