import { SQLQueryParamFn, SQLWhereQuery } from '@mobilejazz/harmony-core';

export class OAuthUserIdQuery extends SQLWhereQuery {
    constructor(readonly userId: string) {
        super();
    }
    where(param: SQLQueryParamFn): string {
        return `user_id = ${param(this.userId)}`;
    }
}
