import {
  IdQuery,
  SQLDialect,
  SQLQueryParamFn,
  SQLWhereQuery,
} from '@mobilejazz/harmony-core';

export class BasicUserInfoQuery extends IdQuery<number> {}

export class UserEmailQuery extends SQLWhereQuery {
  constructor(public readonly email: string) {
    super();
  }

  where(param?: SQLQueryParamFn, dialect?: SQLDialect): string {
    return 'email = ' + param(this.email);
  }
}
