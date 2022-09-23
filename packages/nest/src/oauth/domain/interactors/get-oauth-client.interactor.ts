import { OAuthClientModel } from '../oauth-client.model';
import { GetInteractor } from '@mobilejazz/harmony-core';
import { OAuthClientQuery } from '../../data/datasource/query/oauth-client.query';

export class GetOAuthClientInteractor {
    constructor(private readonly getClient: GetInteractor<OAuthClientModel>) {}

    public execute(clientId: string, clientSecret: string): Promise<OAuthClientModel> {
        return this.getClient.execute(new OAuthClientQuery(clientId, clientSecret));
    }
}
