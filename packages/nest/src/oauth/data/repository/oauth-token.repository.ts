import {
    DeleteDataSource,
    DeleteRepository,
    GetDataSource,
    GetRepository,
    IdQuery,
    InvalidArgumentError,
    MethodNotImplementedError,
    Operation,
    PutDataSource,
    PutRepository,
    Query,
    VoidQuery,
    Logger,
    DeviceConsoleLogger,
} from '@mobilejazz/harmony-core';
import { OAuthTokenModel } from '../../domain/oauth-token.model';
import { OAuthClientModel } from '../../domain/oauth-client.model';
import { OAuthTokenEntity } from '../entity/oauth-token.entity';
import { OAuthClientIdQuery } from '../datasource/query/oauth-client-id.query';
import { OAuthTokenScopeEntity } from '../entity/oauth-token-scope.entity';
import { OAuthTokenIdQuery } from '../datasource/query/oauth-token-id.query';

export class OAuthTokenRepository
    implements GetRepository<OAuthTokenModel>, PutRepository<OAuthTokenModel>, DeleteRepository
{
    constructor(
        private readonly getClientRepository: GetRepository<OAuthClientModel>,
        private readonly getTokenDataSource: GetDataSource<OAuthTokenEntity>,
        private readonly putTokenDataSource: PutDataSource<OAuthTokenEntity>,
        private readonly deleteTokenDataSource: DeleteDataSource,
        private readonly getTokenScopeDataSource: GetDataSource<OAuthTokenScopeEntity>,
        private readonly putTokenScopeDataSource: PutDataSource<OAuthTokenScopeEntity>,
        private readonly deleteTokenScopeDataSource: DeleteDataSource,
        private readonly logger: Logger = new DeviceConsoleLogger(),
    ) {}

    async get(query: Query, operation: Operation): Promise<OAuthTokenModel> {
        const token = await this.getTokenDataSource.get(query);
        const client = await this.getClientRepository.get(new IdQuery(token.clientId), operation);
        const scopes = await this.getTokenScopeDataSource.getAll(new OAuthTokenIdQuery(token.id));
        return new OAuthTokenModel(
            token.id,
            token.createdAt,
            token.updatedAt,
            token.accessToken,
            token.accessTokenExpiresAt,
            token.refreshToken,
            token.refreshTokenExpiresAt,
            client,
            scopes.map((s) => s.scope),
        );
    }

    async getAll(_query: Query, _operation: Operation): Promise<OAuthTokenModel[]> {
        throw new MethodNotImplementedError();
    }

    async put(value: OAuthTokenModel, _query: Query, operation: Operation): Promise<OAuthTokenModel> {
        if (!value.client.clientId) {
            throw new InvalidArgumentError('Missing client Id in token');
        }
        const client = await this.getClientRepository.get(new OAuthClientIdQuery(value.client.clientId), operation);
        const entity = new OAuthTokenEntity(
            value.id,
            value.createdAt,
            value.updatedAt,
            value.accessToken,
            value.accessTokenExpiresAt,
            value.refreshToken,
            value.refreshTokenExpiresAt,
            client.id,
        );
        const token = await this.putTokenDataSource.put(entity, new VoidQuery());
        let scope: string[];
        if (value.scope !== undefined && value.scope !== null && value.scope.length > 0) {
            // Deleting all grants
            this.logger.warning('[DEPRECATION] `deleteAll` will be deprecated. Use `delete` instead.');
            await this.deleteTokenScopeDataSource.deleteAll(new OAuthTokenIdQuery(token.id));
            // Adding new grants
            scope = await this.putTokenScopeDataSource
                .putAll(
                    value.scope.map((s) => new OAuthTokenScopeEntity(undefined, undefined, undefined, s, token.id)),
                    new VoidQuery(),
                )
                .then((array) => array.map((s) => s.scope));
        }
        return new OAuthTokenModel(
            token.id,
            token.createdAt,
            token.updatedAt,
            token.accessToken,
            token.accessTokenExpiresAt,
            token.refreshToken,
            token.refreshTokenExpiresAt,
            client,
            scope,
        );
    }

    async putAll(_values: OAuthTokenModel[], _query: Query, _operation: Operation): Promise<OAuthTokenModel[]> {
        throw new MethodNotImplementedError();
    }

    async delete(query: Query, _operation: Operation): Promise<void> {
        // token scopes will be deleted as table column is configured on delete cascade.
        return this.deleteTokenDataSource.delete(query);
    }

    async deleteAll(query: Query, _operation: Operation): Promise<void> {
        // token scopes will be deleted as table column is configured on delete cascade.
        this.logger.warning('[DEPRECATION] `deleteAll` will be deprecated. Use `delete` instead.');
        return this.deleteTokenDataSource.delete(query);
    }
}
