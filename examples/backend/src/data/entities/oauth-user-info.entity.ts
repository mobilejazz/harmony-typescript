import { UserRole } from './user.entity';

export class OauthUserInfoEntity {
  constructor(
    readonly id: number,
    readonly passwordSalt: string,
    readonly passwordHashAlgorithm: string,
    readonly role: UserRole,
  ) {}
}
