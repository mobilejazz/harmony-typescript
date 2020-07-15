import {SQLWhereQuery, SQLDialect} from '@mobilejazz/harmony-core';

export class OAuthRefreshTokenQuery extends SQLWhereQuery {
    constructor(
        readonly refreshToken: string,
    ) { super(); }
    whereParams(): any[] {
        return [this.refreshToken];
    }
    whereSql(dialect: SQLDialect): string {
        return `refresh_token = ${dialect.getParameterSymbol(1)}`;
    }
}
