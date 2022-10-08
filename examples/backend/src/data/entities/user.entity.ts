import { BaseEntity } from './base.entity';

enum UserRole {
    ADMIN = 1,
}

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace UserRole {
    export const ALL = [UserRole.ADMIN];

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
        public readonly email: string,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly role: UserRole,
    ) {
        super(id, createdAt, updatedAt);
    }
}
