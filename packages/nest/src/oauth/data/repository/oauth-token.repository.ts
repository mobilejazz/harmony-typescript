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
    QueryNotSupportedError,
} from '@mobilejazz/harmony-core';

import { OAuthTokenModel } from '../../domain/oauth-token.model';
import { OAuthClientModel } from '../../domain/oauth-client.model';
import { OAuthTokenEntity } from '../entity/oauth-token.entity';
import { OAuthClientIdQuery } from '../datasource/query/oauth-client-id.query';
import { OAuthTokenScopeEntity } from '../entity/oauth-token-scope.entity';
import { OAuthTokenIdQuery } from '../datasource/query/oauth-token-id.query';
import { SaveTokenQuery } from '../queries/token.query';

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
    ) {}

    private tokenEntityToModel(
        token: OAuthTokenEntity,
        client: OAuthClientModel,
        scope: OAuthTokenScopeEntity[],
    ): OAuthTokenModel {
        // Cast to concrete types, since this comes from the DB we're sure these are not `undefined`
        return new OAuthTokenModel(
            token.id as number,
            token.createdAt as Date,
            token.updatedAt as Date,
            token.accessToken as string,
            token.accessTokenExpiresAt as Date,
            token.refreshToken as string,
            token.refreshTokenExpiresAt as Date,
            client,
            scope.map((s) => s.scope),
        );
    }

    public async get(query: Query, operation: Operation): Promise<OAuthTokenModel> {
        const token = await this.getTokenDataSource.get(query);
        const [client, scope] = await Promise.all([
            this.getClientRepository.get(new IdQuery(token.clientId), operation),
            this.getTokenScopeDataSource.getAll(new OAuthTokenIdQuery(token.id as number)),
        ]);

        return this.tokenEntityToModel(token, client, scope);
    }

    public async getAll(_query: Query, _operation: Operation): Promise<OAuthTokenModel[]> {
        throw new MethodNotImplementedError();
    }

    public async put(
        _value: OAuthTokenModel | undefined,
        query: Query,
        operation: Operation,
    ): Promise<OAuthTokenModel> {
        if (query instanceof SaveTokenQuery) {
            if (!query.clientId) {
                throw new InvalidArgumentError(`Missing client ID in 'CreateTokenQuery'`);
            }

            const client = await this.getClientRepository.get(new OAuthClientIdQuery(query.clientId), operation);
            const token = await this.putTokenDataSource.put(
                new OAuthTokenEntity(
                    undefined,
                    undefined,
                    undefined,
                    query.accessToken,
                    query.accessTokenExpiresAt,
                    query.refreshToken,
                    query.refreshTokenExpiresAt,
                    client.id,
                ),
                new VoidQuery(),
            );

            let scope: OAuthTokenScopeEntity[] = [];

            if (query.hasScope()) {
                // Delete all grants
                await this.deleteTokenScopeDataSource.delete(new OAuthTokenIdQuery(token.id as number));

                // Add new grants
                scope = await this.putTokenScopeDataSource.putAll(
                    (query.scope as string[]).map(
                        (s) => new OAuthTokenScopeEntity(undefined, undefined, undefined, s, token.id as number),
                    ),
                    new VoidQuery(),
                );
            }

            return this.tokenEntityToModel(token, client, scope);
        }

        throw new QueryNotSupportedError();
    }

    public async putAll(
        _values: OAuthTokenModel[] | undefined,
        _query: Query,
        _operation: Operation,
    ): Promise<OAuthTokenModel[]> {
        throw new MethodNotImplementedError();
    }

    public async delete(query: Query, _operation: Operation): Promise<void> {
        // token scopes will be deleted as table column is configured on delete cascade.
        return this.deleteTokenDataSource.delete(query);
    }
}
