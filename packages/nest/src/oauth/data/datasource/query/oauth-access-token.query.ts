import {SQLWhereQuery, SQLDialect} from "@mobilejazz/harmony-core";

export class OAuthAccessTokenQuery extends SQLWhereQuery {
    constructor(
        readonly accessToken: string,
    ) { super(); }
    whereParams(): any[] {
        return [this.accessToken];
    }
    whereSql(dialect: SQLDialect): string {
        return `access_token = ${dialect.getParameterSymbol(1)}`;
    }
}
