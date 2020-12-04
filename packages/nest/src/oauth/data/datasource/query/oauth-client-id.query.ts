import {SQLWhereQuery, SQLQueryParamComposer} from '@mobilejazz/harmony-core';

export class OAuthClientIdQuery extends SQLWhereQuery {
    constructor(
        readonly clientId: string|number,
    ) { super(); }
    whereSql(params: SQLQueryParamComposer): string {
        return `client_id = ${params.next(this.clientId)}`;
    }
}
