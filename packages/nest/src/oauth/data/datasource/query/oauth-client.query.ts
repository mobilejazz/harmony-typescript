import {SQLWhereQuery, SQLDialect, SQLQueryParamComposer} from '@mobilejazz/harmony-core';

export class OAuthClientQuery extends SQLWhereQuery {
    constructor(
        readonly clientId: string,
        readonly clientSecret: string,
    ) { super(); }
    whereParams(): any[] {
        return [this.clientId, this.clientSecret];
    }
    whereSql(dialect: SQLDialect, params: SQLQueryParamComposer): string {
        return `client_id = ${params.next()} and client_secret = ${params.next()}`;
    }
}
