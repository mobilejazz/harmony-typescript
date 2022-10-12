import {
    BaseColumnCreatedAt,
    BaseColumnId,
    BaseColumnUpdatedAt,
    Mapper,
    RawSQLData,
} from '@mobilejazz/harmony-core';
import { UserEntity, UserRole } from '../../../entities/user.entity';
import {
    UserTableColumnEmail,
    UserTableColumnFirstName,
    UserTableColumnLastName,
    UserTableColumnRoleId,
} from '../database.constants';

export class UserRawSQLDataToUserEntityMapper
    implements Mapper<RawSQLData, UserEntity>
{
    public map(from: RawSQLData): UserEntity {
        return new UserEntity(
            from[BaseColumnId] as number,
            from[BaseColumnCreatedAt] as Date,
            from[BaseColumnUpdatedAt] as Date,
            from[UserTableColumnEmail] as string,
            from[UserTableColumnFirstName] as string,
            from[UserTableColumnLastName] as string,
            from[UserTableColumnRoleId] as UserRole,
        );
    }
}

export class UserEntityToUserRawSQLDataMapper
    implements Mapper<UserEntity, RawSQLData>
{
    public map(from: UserEntity): RawSQLData {
        return {
            [BaseColumnId]: from.id,
            [UserTableColumnEmail]: from.email,
            [UserTableColumnFirstName]: from.firstName,
            [UserTableColumnLastName]: from.lastName,
            [UserTableColumnRoleId]: from.role,
        };
    }
}
