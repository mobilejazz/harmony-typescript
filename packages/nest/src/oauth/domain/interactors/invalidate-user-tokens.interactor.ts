import { DeleteInteractor } from '@mobilejazz/harmony-core';

import { OAuthUserIdQuery } from '../../data/datasource/query/oauth-user-id.query';

export class InvalidateUserTokensInteractor {
    constructor(private readonly deleteTokens: DeleteInteractor) {}

    public async execute(userId: string): Promise<void> {
        return this.deleteTokens.execute(new OAuthUserIdQuery(userId));
    }
}
