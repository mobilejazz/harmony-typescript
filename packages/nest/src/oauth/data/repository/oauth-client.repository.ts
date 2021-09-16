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
    Logger,
    DeviceConsoleLogger,
} from '@mobilejazz/harmony-core';
import {OAuthClientModel} from '../../domain/oauth-client.model';
import {OAuthClientEntity} from '../entity/oauth-client.entity';
import {OAuthClientGrantEntity} from '../entity/oauth-client-grant.entity';
import {OAuthClientIdQuery} from '../datasource/query/oauth-client-id.query';

export class OAuthClientRepository implements GetRepository<OAuthClientModel>, PutRepository<OAuthClientModel>, DeleteRepository {
    constructor(
        private readonly getClientDataSource: GetDataSource<OAuthClientEntity>,
        private readonly putClientDataSource: PutDataSource<OAuthClientEntity>,
        private readonly deleteClientDataSource: DeleteDataSource,
        private readonly getClientGrantsDataSource: GetDataSource<OAuthClientGrantEntity>,
        private readonly putClientGrantsDataSource: PutDataSource<OAuthClientGrantEntity>,
        private readonly deleteClientGrantsDataSource: DeleteDataSource,
        private readonly logger: Logger = new DeviceConsoleLogger(),
    ) {}

    async get(query: Query, _operation: Operation): Promise<OAuthClientModel> {
        const client =  await this.getClientDataSource.get(query);
        const grants = await this.getClientGrantsDataSource.getAll(new OAuthClientIdQuery(client.id));
        return new OAuthClientModel(
            client.id,
            client.createdAt,
            client.updatedAt,
            client.clientId,
            client.clientSecret,
            grants.map(el => el.grant),
            client.accessTokenLifetime,
            client.refreshTokenLifetime,
        );
    }

    async getAll(query: Query, _operation: Operation): Promise<OAuthClientModel[]> {
        const clients = await this.getClientDataSource.getAll(query);
        return Promise.all(clients.map(client => {
            return this.getClientGrantsDataSource
                .getAll(new OAuthClientIdQuery(client.id))
                .then(grants => {
                    return new OAuthClientModel(
                        client.id,
                        client.createdAt,
                        client.updatedAt,
                        client.clientId,
                        client.clientSecret,
                        grants.map(el => el.grant),
                        client.accessTokenLifetime,
                        client.refreshTokenLifetime,
                    );
                });
        }));
    }

    async put(value: OAuthClientModel, query: Query, _operation: Operation): Promise<OAuthClientModel> {
        const entity = new OAuthClientEntity(
            value.id,
            value.createdAt,
            value.updatedAt,
            value.clientId,
            value.clientSecret,
            value.accessTokenLifetime,
            value.refreshTokenLifetime,
        );
        const client = await this.putClientDataSource.put(value, query);
        let grants: string[];
        if (value.grants !== undefined) {
            // Deleting all grants
            this.logger.warning('[DEPRECATION] `deleteAll` will be deprecated. Use `delete` instead.');
            await this.deleteClientGrantsDataSource.deleteAll(new OAuthClientIdQuery(client.id));
            // Adding new grants
            grants = await this.putClientGrantsDataSource
                .putAll(value.grants.map(el => new OAuthClientGrantEntity(null, null, null, el, client.id)), new VoidQuery())
                .then(array => array.map(el => el.grant));
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

    async putAll(_values: OAuthClientModel[], _query: Query, _operation: Operation): Promise<OAuthClientModel[]> {
        throw new MethodNotImplementedError();
    }

    async delete(query: Query, _operation: Operation): Promise<void> {
        // client grants will be deleted as table column is configured on delete cascade.
        return this.deleteClientDataSource.delete(query);
    }

    deleteAll(_query: Query, _operation: Operation): Promise<void> {
        this.logger.warning('[DEPRECATION] `deleteAll` will be deprecated. Use `delete` instead.');
        // client grants will be deleted as table column is configured on delete cascade.
        return undefined;
    }
}
