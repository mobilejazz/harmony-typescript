import {SQLWhereQuery, SQLDialect} from '@mobilejazz/harmony-core';

export class OAuthClientIdQuery extends SQLWhereQuery {
    constructor(
        private readonly clientId: string|number,
    ) { super(); }
    whereParams(): any[] {
        return [this.clientId];
    }
    whereSql(dialect: SQLDialect): string {
        return `client_id = ${dialect.getParameterSymbol(1)}`;
    }
}
