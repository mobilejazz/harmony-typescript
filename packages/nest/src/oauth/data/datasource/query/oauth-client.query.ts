import {SQLWhereQuery, SQLDialect} from '@mobilejazz/harmony-core';

export class OAuthClientQuery extends SQLWhereQuery {
    constructor(
        readonly clientId: string,
        readonly clientSecret: string,
    ) { super(); }
    whereParams(): any[] {
        return [this.clientId, this.clientSecret];
    }
    whereSql(dialect: SQLDialect): string {
        return `client_id = ${dialect.getParameterSymbol(1)} and client_secret = ${dialect.getParameterSymbol(2)}`;
    }
}
