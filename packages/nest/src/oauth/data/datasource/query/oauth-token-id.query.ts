import {SQLQueryParamFn, SQLWhereQuery} from '@mobilejazz/harmony-core';

export class OAuthTokenIdQuery extends SQLWhereQuery {
    constructor(
        private readonly tokenId: string|number,
    ) { super(); }
    where(param: SQLQueryParamFn): string {
        return `token_id = ${param(this.tokenId)}`;
    }
}
