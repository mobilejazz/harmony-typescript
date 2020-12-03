import {SQLDialect, SQLQueryParamComposer, SQLWhereQuery} from '@mobilejazz/harmony-core';

export class OAuthUserIdQuery extends SQLWhereQuery {
    constructor(
        readonly userId: string,
    ) { super(); }
    whereParams(): any[] {
        return [this.userId];
    }
    whereSql(dialect: SQLDialect, params: SQLQueryParamComposer): string {
        return `user_id = ${params.next()}`;
    }
}
