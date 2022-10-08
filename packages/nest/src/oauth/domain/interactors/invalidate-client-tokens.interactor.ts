import { DeleteInteractor } from '@mobilejazz/harmony-core';

import { OAuthClientIdQuery } from '../../data/datasource/query/oauth-client-id.query';

export class InvalidateClientTokensInteractor {
    constructor(private readonly deleteTokens: DeleteInteractor) {}

    public async execute(clientId: string): Promise<void> {
        return this.deleteTokens.execute(new OAuthClientIdQuery(clientId));
    }
}
