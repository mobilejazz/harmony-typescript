import {
    DeleteDataSource,
    DeleteRepository,
    GetDataSource,
    GetRepository,
    MethodNotImplementedError,
    Operation,
    PutDataSource,
    PutRepository,
    Query,
    VoidQuery,
    InvalidArgumentError,
} from '@mobilejazz/harmony-core';

import { OAuthClientModel } from '../../domain/oauth-client.model';
import { OAuthClientEntity } from '../entity/oauth-client.entity';
import { OAuthClientGrantEntity } from '../entity/oauth-client-grant.entity';
import { OAuthClientIdQuery } from '../datasource/query/oauth-client-id.query';

export class OAuthClientRepository
    implements GetRepository<OAuthClientModel>, PutRepository<OAuthClientModel>, DeleteRepository
{
    constructor(
        private readonly getClientDataSource: GetDataSource<OAuthClientEntity>,
        private readonly putClientDataSource: PutDataSource<OAuthClientEntity>,
        private readonly deleteClientDataSource: DeleteDataSource,
        private readonly getClientGrantsDataSource: GetDataSource<OAuthClientGrantEntity>,
        private readonly putClientGrantsDataSource: PutDataSource<OAuthClientGrantEntity>,
        private readonly deleteClientGrantsDataSource: DeleteDataSource,
    ) {}

    public async get(query: Query, _operation: Operation): Promise<OAuthClientModel> {
        const client = await this.getClientDataSource.get(query);
        const grants = await this.getClientGrantsDataSource.getAll(new OAuthClientIdQuery(client.id as number));

        return new OAuthClientModel(
            client.id,
            client.createdAt,
            client.updatedAt,
            client.clientId,
            client.clientSecret,
            grants.map((el) => el.grant),
            client.accessTokenLifetime,
            client.refreshTokenLifetime,
        );
    }

    public async getAll(query: Query, _operation: Operation): Promise<OAuthClientModel[]> {
        const clients = await this.getClientDataSource.getAll(query);

        return Promise.all(
            clients.map(async (client) => {
                const grants = await this.getClientGrantsDataSource.getAll(new OAuthClientIdQuery(client.id as number));

                return new OAuthClientModel(
                    client.id,
                    client.createdAt,
                    client.updatedAt,
                    client.clientId,
                    client.clientSecret,
                    grants.map((el) => el.grant),
                    client.accessTokenLifetime,
                    client.refreshTokenLifetime,
                );
            }),
        );
    }

    public async put(value: OAuthClientModel | undefined, query: Query, _operation: Operation): Promise<OAuthClientModel> {
        if (!value) {
            throw new InvalidArgumentError(`Missing "value", please provide an "OAuthClientModel"`);
        }

        const client = await this.putClientDataSource.put(value, query);
        let grants: string[] = [];

        if (value.grants !== undefined) {
            // Deleting all grants
            await this.deleteClientGrantsDataSource.delete(new OAuthClientIdQuery(client.id as number));

            // Adding new grants
            const grantEntities = await this.putClientGrantsDataSource.putAll(
                value.grants.map((el) => new OAuthClientGrantEntity(undefined, undefined, undefined, el, client.id as number)),
                new VoidQuery(),
            );

            grants = grantEntities.map((el) => el.grant);
        }

        return new OAuthClientModel(
            client.id,
            client.createdAt,
            client.updatedAt,
            client.clientId,
            client.clientSecret,
            grants,
            client.accessTokenLifetime,
            client.refreshTokenLifetime,
        );
    }

    public async putAll(_values: OAuthClientModel[] | undefined, _query: Query, _operation: Operation): Promise<OAuthClientModel[]> {
        throw new MethodNotImplementedError();
    }

    public async delete(query: Query, _operation: Operation): Promise<void> {
        // client grants will be deleted as table column is configured on delete cascade.
        return this.deleteClientDataSource.delete(query);
    }
}
