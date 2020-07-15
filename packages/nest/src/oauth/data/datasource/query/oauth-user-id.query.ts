import {SQLDialect, SQLWhereQuery} from "@mobilejazz/harmony-core";

export class OAuthUserIdQuery extends SQLWhereQuery {
    constructor(
        readonly userId: string,
    ) { super(); }
    whereParams(): any[] {
        return [this.userId];
    }
    whereSql(dialect: SQLDialect): string {
        return `user_id = ${dialect.getParameterSymbol(1)}`;
    }
}
