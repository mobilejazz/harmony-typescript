import { SQLWhereQuery, SQLQueryParamFn } from '@mobilejazz/harmony-core';

export class OAuthClientQuery extends SQLWhereQuery {
    constructor(readonly clientId: string, readonly clientSecret: string) {
        super();
    }
    where(param: SQLQueryParamFn): string {
        return `client_id = ${param(this.clientId)} and client_secret = ${param(this.clientSecret)}`;
    }
}
