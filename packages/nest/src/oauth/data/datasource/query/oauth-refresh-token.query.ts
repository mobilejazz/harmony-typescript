import {SQLWhereQuery, SQLDialect, SQLQueryParamComposer} from '@mobilejazz/harmony-core';

export class OAuthRefreshTokenQuery extends SQLWhereQuery {
    constructor(
        readonly refreshToken: string,
    ) { super(); }
    whereParams(): any[] {
        return [this.refreshToken];
    }
    whereSql(dialect: SQLDialect, params: SQLQueryParamComposer): string {
        return `refresh_token = ${params.next()}`;
    }
}
