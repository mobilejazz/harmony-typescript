import {SQLWhereQuery, SQLQueryParamComposer} from '@mobilejazz/harmony-core';

export class OAuthTokenIdQuery extends SQLWhereQuery {
    constructor(
        private readonly tokenId: string|number,
    ) { super(); }
    whereSql(params: SQLQueryParamComposer): string {
        return `token_id = ${params.next(this.tokenId)}`;
    }
}
