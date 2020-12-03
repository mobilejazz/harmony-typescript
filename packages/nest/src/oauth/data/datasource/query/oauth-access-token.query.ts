import {SQLWhereQuery, SQLDialect, SQLQueryParamComposer} from '@mobilejazz/harmony-core';

export class OAuthAccessTokenQuery extends SQLWhereQuery {
    constructor(
        readonly accessToken: string,
    ) { super(); }
    whereParams(): any[] {
        return [this.accessToken];
    }
    whereSql(dialect: SQLDialect, params: SQLQueryParamComposer): string {
        return `access_token = ${params.next()}`;
    }
}
