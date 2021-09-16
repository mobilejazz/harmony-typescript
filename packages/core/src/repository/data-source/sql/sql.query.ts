import {PaginationOffsetLimitQuery, Query, SQLQueryParamFn} from '../..';
import {SQLOrderBy, SQLWhere} from "./raw-sql.data-source";
import {BaseColumnCreatedAt} from "./sql.constants";
import {SQLDialect} from '../../../data';

export abstract class SQLOrderByQuery extends Query implements SQLOrderBy {
    abstract orderBy(param?: SQLQueryParamFn, dialect?: SQLDialect): string;
    abstract ascending(): boolean;
}

export abstract class SQLOrderByPaginationQuery extends PaginationOffsetLimitQuery implements SQLOrderBy {
    abstract orderBy(param?: SQLQueryParamFn, dialect?: SQLDialect): string;
    abstract ascending(): boolean;
}

export abstract class SQLWhereQuery extends SQLOrderByQuery implements SQLWhere {
    abstract where(param?: SQLQueryParamFn, dialect?: SQLDialect): string;

    orderBy(_param?: SQLQueryParamFn, _dialect?: SQLDialect): string {
        return BaseColumnCreatedAt;
    }

    ascending(): boolean {
        return false;
    }
}

export abstract class SQLWherePaginationQuery extends SQLOrderByPaginationQuery implements SQLWhere {
    abstract where(param?: SQLQueryParamFn, dialect?: SQLDialect): string;

    orderBy(_param?: SQLQueryParamFn, _dialect?: SQLDialect): string {
        return BaseColumnCreatedAt;
    }

    ascending(): boolean {
        return false;
    }
}
