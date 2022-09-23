import { OAuthUser } from '@mobilejazz/harmony-nest';

import { UserRole } from '../../data/entities/user.entity';

export class OauthUserInfoModel implements OAuthUser {
    constructor(
        readonly id: number,
        readonly passwordSalt: string,
        readonly passwordHashAlgorithm: string,
        readonly role: UserRole,
    ) {}

    oauthId(): string {
        return this.id.toString();
    }
}
