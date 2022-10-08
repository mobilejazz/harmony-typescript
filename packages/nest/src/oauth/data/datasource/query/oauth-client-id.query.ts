import { SQLWhereQuery, SQLQueryParamFn } from '@mobilejazz/harmony-core';

export class OAuthClientIdQuery extends SQLWhereQuery {
    constructor(readonly clientId: string | number) {
        super();
    }

    where(param: SQLQueryParamFn): string {
        return `client_id = ${param(this.clientId)}`;
    }
}
