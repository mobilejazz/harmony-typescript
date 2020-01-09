import {PaginationOffsetLimitQuery, Query} from "../..";
import {SQLOrderBy, SQLWhere} from "./raw-mysql.data-source";
import {BaseColumnCreatedAt} from "./sql.constants";

export abstract class SQLOrderByQuery extends Query implements SQLOrderBy {
    abstract orderBy(): string;
    abstract ascending(): boolean;
}

export abstract class SQLOrderByPaginationQuery extends PaginationOffsetLimitQuery implements SQLOrderBy {
    abstract orderBy(): string;
    abstract ascending(): boolean;
}

export abstract class SQLWhereQuery extends SQLOrderByQuery implements SQLWhere {
    abstract whereSql(): string;
    abstract whereParams(): any[];

    orderBy(): string {
        return BaseColumnCreatedAt;
    }

    ascending(): boolean {
        return false;
    }
}

export abstract class SQLWherePaginationQuery extends SQLOrderByPaginationQuery implements SQLWhere {
    abstract whereSql(): string;
    abstract whereParams(): any[];

    orderBy(): string {
        return BaseColumnCreatedAt;
    }

    ascending(): boolean {
        return false;
    }
}
