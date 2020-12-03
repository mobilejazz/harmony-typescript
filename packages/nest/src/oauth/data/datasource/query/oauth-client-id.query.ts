import {SQLWhereQuery, SQLDialect, SQLQueryParamComposer} from '@mobilejazz/harmony-core';

export class OAuthClientIdQuery extends SQLWhereQuery {
    constructor(
        readonly clientId: string|number,
    ) { super(); }
    whereParams(): any[] {
        return [this.clientId];
    }
    whereSql(dialect: SQLDialect, params: SQLQueryParamComposer): string {
        return `client_id = ${params.next()}`;
    }
}
