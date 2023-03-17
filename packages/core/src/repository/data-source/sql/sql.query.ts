import { PaginationOffsetLimitQuery, Query, SQLQueryParamFn } from '../..';
import { BaseColumnCreatedAt } from './sql.constants';
import { SQLDialect } from '../../../data';
import { SQLOrderBy, SQLWhere } from './abstract-raw-sql.data-source';

export abstract class SQLOrderByQuery extends Query implements SQLOrderBy {
    public abstract orderBy(param: SQLQueryParamFn, dialect: SQLDialect): string;
    public abstract ascending(): boolean;
}

export abstract class SQLOrderByPaginationQuery extends PaginationOffsetLimitQuery implements SQLOrderBy {
    public abstract orderBy(param: SQLQueryParamFn, dialect: SQLDialect): string;
    public abstract ascending(): boolean;
}

export abstract class SQLWhereQuery extends SQLOrderByQuery implements SQLWhere {
    public abstract where(param: SQLQueryParamFn, dialect: SQLDialect): string;

    public orderBy(): string {
        return BaseColumnCreatedAt;
    }

    public ascending(): boolean {
        return false;
    }
}

export abstract class SQLWherePaginationQuery extends SQLOrderByPaginationQuery implements SQLWhere {
    public abstract where(param: SQLQueryParamFn, dialect: SQLDialect): string;

    public orderBy(): string {
        return BaseColumnCreatedAt;
    }

    public ascending(): boolean {
        return false;
    }
}
