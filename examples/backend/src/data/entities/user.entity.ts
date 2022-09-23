import { BaseEntity } from './base.entity';

enum UserRole {
  ADMIN = 1,
}

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace UserRole {
  export const all = [UserRole.ADMIN];

  export function description() {
    return '[1: admin]';
  }
}

export { UserRole };

export class UserEntity extends BaseEntity {
  constructor(
    id: number,
    createdAt: Date,
    updatedAt: Date,
    readonly email: string,
    readonly firstName: string,
    readonly lastName: string,
    readonly role: UserRole,
  ) {
    super(id, createdAt, updatedAt);
  }
}
