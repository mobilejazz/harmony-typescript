import {SQLDialect, SQLQueryParamComposer, SQLWhereQuery} from '@mobilejazz/harmony-core';

export class OAuthUserIdQuery extends SQLWhereQuery {
    constructor(
        readonly userId: string,
    ) { super(); }
    whereSql(params: SQLQueryParamComposer): string {
        return `user_id = ${params.next(this.userId)}`;
    }
}
