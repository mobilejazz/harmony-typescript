import {PaginationOffsetLimitQuery, Query, SQLQueryParamComposer} from '../..';
import {SQLOrderBy, SQLWhere} from "./raw-sql.data-source";
import {BaseColumnCreatedAt} from "./sql.constants";
import {SQLDialect} from "../../../data";

export abstract class SQLOrderByQuery extends Query implements SQLOrderBy {
    abstract orderBy(dialect?: SQLDialect, params?: SQLQueryParamComposer): string;
    orderByParams(): any[] {
        return [];
    }
    abstract ascending(): boolean;
}

export abstract class SQLOrderByPaginationQuery extends PaginationOffsetLimitQuery implements SQLOrderBy {
    abstract orderBy(dialect?: SQLDialect, params?: SQLQueryParamComposer): string;
    orderByParams(): any[] {
        return [];
    }
    abstract ascending(): boolean;
}

export abstract class SQLWhereQuery extends SQLOrderByQuery implements SQLWhere {
    abstract whereSql(dialect?: SQLDialect, params?: SQLQueryParamComposer): string;
    abstract whereParams(): any[];

    orderBy(dialect?: SQLDialect, params?: SQLQueryParamComposer): string {
        return BaseColumnCreatedAt;
    }

    orderByParams(): any[] {
        return [];
    }

    ascending(): boolean {
        return false;
    }
}

export abstract class SQLWherePaginationQuery extends SQLOrderByPaginationQuery implements SQLWhere {
    abstract whereSql(dialect?: SQLDialect, params?: SQLQueryParamComposer): string;
    abstract whereParams(): any[];

    orderBy(dialect?: SQLDialect, params?: SQLQueryParamComposer): string {
        return BaseColumnCreatedAt;
    }

    orderByParams(): any[] {
        return [];
    }

    ascending(): boolean {
        return false;
    }
}
