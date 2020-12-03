import {SQLWhereQuery, SQLDialect, SQLQueryParamComposer} from '@mobilejazz/harmony-core';

export class OAuthTokenIdQuery extends SQLWhereQuery {
    constructor(
        private readonly tokenId: string|number,
    ) { super(); }
    whereParams(): any[] {
        return [this.tokenId];
    }
    whereSql(dialect: SQLDialect, params: SQLQueryParamComposer): string {
        return `token_id = ${params.next()}`;
    }
}
