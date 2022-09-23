import {
  BaseColumnCreatedAt,
  BaseColumnDeletedAt,
  BaseColumnId,
  BaseColumnUpdatedAt,
  NotFoundError,
  Query,
  RawSQLData,
  RawSQLDataSource,
  SQLDialect,
  SQLInterface,
} from '@mobilejazz/harmony-core';
import {
  UserTableColumnEmail,
  UserTableColumnFirstName,
  UserTableColumnLastName,
  UserTableColumnRoleId,
  UserTableName,
} from './database.constants';
import { BasicUserInfoQuery } from '../../queries/user.query';

export class UserMysqlDataSource extends RawSQLDataSource {
  constructor(
    dialect: SQLDialect,
    db: SQLInterface,
    readonly softDeletedEnabled: boolean,
  ) {
    super(
      dialect,
      db,
      UserTableName,
      [
        UserTableColumnEmail,
        UserTableColumnFirstName,
        UserTableColumnLastName,
        UserTableColumnRoleId,
      ],
      BaseColumnId,
      BaseColumnCreatedAt,
      BaseColumnUpdatedAt,
      BaseColumnDeletedAt,
      softDeletedEnabled,
    );
  }

  public async get(query: Query): Promise<RawSQLData> {
    if (query instanceof BasicUserInfoQuery) {
      return this.sqlInterface
        .query<RawSQLData[]>(
          'SELECT u1.id, u1.email, u1.first_name, u1.last_name, u1.role_id FROM user u1 WHERE u1.id = ? AND u1.deleted_at is null',
          [query.id],
        )
        .catch((e) => {
          throw this.sqlDialect.mapError(e);
        })
        .then((results) => {
          if (results.length === 0) {
            throw new NotFoundError();
          } else {
            return results[0];
          }
        });
    }

    return super.get(query);
  }

  public async getAll(query: Query): Promise<RawSQLData[]> {
    return super.getAll(query);
  }

  public async put(value: RawSQLData, query: Query): Promise<RawSQLData> {
    return super.put(value, query);
  }

  public async delete(query: Query): Promise<void> {
    return super.delete(query);
  }
}
