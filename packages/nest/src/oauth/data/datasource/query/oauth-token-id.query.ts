import {SQLWhereQuery, SQLDialect} from '@mobilejazz/harmony-core';

export class OAuthTokenIdQuery extends SQLWhereQuery {
    constructor(
        private readonly tokenId: string|number,
    ) { super(); }
    whereParams(): any[] {
        return [this.tokenId];
    }
    whereSql(dialect: SQLDialect): string {
        return `token_id = ${dialect.getParameterSymbol(1)}`;
    }
}
