import {OAuthProvider} from './oauth.provider';
import {GetOAuthClientInteractor} from './domain/interactors/get-oauth-client.interactor';
import {GetOAuthTokenInteractor} from './domain/interactors/get-oauth-token.interactor';
import {PutOAuthTokenInteractor} from './domain/interactors/put-oauth-token.interactor';
import {DeleteOAuthTokenInteractor} from './domain/interactors/delete-oauth-token.interactor';
import {GetOAuthUserInfoInteractor} from './domain/interactors/get-oauth-user-info.interactor';
import {OAuthClientRepository} from './data/repository/oauth-client.repository';
import {
    OAuthClientColumnAccessTokenLifetime,
    OAuthClientColumnClientId,
    OAuthClientColumnClientSecret,
    OAuthClientColumnRefreshTokenLifetime,
    OAuthClientGrantColumnClientId,
    OAuthClientGrantColumnGrantName,
    OAuthClientGrantTableName,
    OAuthClientTableName,
    OAuthTokenColumnAccessToken,
    OAuthTokenColumnAccessTokenExpiresAt,
    OAuthTokenColumnClientId,
    OAuthTokenColumnRefreshToken,
    OAuthTokenColumnRefreshTokenExpiresAt,
    OAuthTokenScopeColumnScope,
    OAuthTokenScopeColumnTokenId,
    OAuthTokenScopeTableName,
    OAuthTokenTableName,
    OAuthUserInfoColumnTokenId,
    OAuthUserInfoColumnUserId,
    OAuthUserInfoTableName,
} from './data/datasource/oauth.database-columns.constants';
import {OAuthClientRawSqlToEntityMapper} from './data/datasource/mappers/oauth-client.raw-sql-to-entity.mapper';
import {OAuthClientEntityToRawSqlMapper} from './data/datasource/mappers/oauth-client.entity-to-raw-sql.mapper';
import {OAuthClientGrantRawSqlToEntityMapper} from './data/datasource/mappers/oauth-client-grant.raw-sql-to-entity.mapper';
import {OAuthClientGrantEntityToRawSqlMapper} from './data/datasource/mappers/oauth-client-grant.entity-to-raw-sql.mapper';
import {OAuthTokenRepository} from './data/repository/oauth-token.repository';
import {OAuthTokenRawSqlToEntityMapper} from './data/datasource/mappers/oauth-token.raw-sql-to-entity.mapper';
import {OAuthTokenEntityToRawSqlMapper} from './data/datasource/mappers/oauth-token.entity-to-raw-sql.mapper';
import {OAuthUserInfoModel} from './domain/oauth-user-info.model';
import {OAuthUserInfoRawSqlToEntityMapper} from './data/datasource/mappers/oauth-user-info.raw-sql-to-entity.mapper';
import {OAuthUserInfoEntityToModelMapper} from './domain/mappers/oauth-user-info.entity-to-model.mapper';
import {OAuthUserInfoModelToEntityMapper} from './domain/mappers/oauth-user-info.model-to-entity.mapper';
import {OAuthUserInfoEntityToRawSqlMapper} from './data/datasource/mappers/oauth-user-info.entity-to-raw-sql.mapper';
import {OAuthUserInfoEntity} from './data/entity/oauth-user-info.entity';
import {GetOAuthRefreshTokenInteractor} from './domain/interactors/get-oauth-refresh-token.interactor';
import {
    DataSourceMapper,
    DeleteAllInteractor,
    GetInteractor,
    PutInteractor,
    RawSQLDataSource,
    RepositoryMapper,
    SingleDataSourceRepository,
    SQLInterface,
    SQLDialect,
} from '@mobilejazz/harmony-core';
import {OAuthTokenScopeRawSqlToEntityMapper} from './data/datasource/mappers/oauth-token-scope.raw-sql-to-entity.mapper';
import {OAuthTokenScopeEntityToRawSqlMapper} from './data/datasource/mappers/oauth-token-scope.entity-to-raw-sql.mapper';
import {GetOAuthUserInteractor} from "./domain/interactors/get-oauth-user.interactor";
import {OAuth2UserModel} from "./application/oauth2.user.model";
import {LoginOAuthUserInteractor} from "./domain/interactors/login-oauth-user.interactor";
import {OAuth2BaseModel} from "./application/oauth2.base.model";
import {ValidateScopeInteractor} from "./domain/interactors/validate-scope.interactor";

export class OAuthSQLProvider implements OAuthProvider {
    constructor(
        private readonly sqlDialect: SQLDialect,
        private readonly sqlInterface: SQLInterface,
    ) {}

    public clientModel(): OAuth2BaseModel {
        return new OAuth2BaseModel(
            this.getClient(),
            this.putToken(),
            this.getToken(),
            null,
            null,
        );
    }
    public userModel(
        getUser: GetOAuthUserInteractor,
        loginUser: LoginOAuthUserInteractor,
        scopeValidation: ValidateScopeInteractor,
        ): OAuth2UserModel {
        return new OAuth2UserModel(
            this.getClient(),
            this.putToken(),
            this.getToken(),
            this.getUserInfo(),
            getUser,
            loginUser,
            this.getRefreshToken(),
            this.deleteToken(),
            scopeValidation,
        );
    }

    private deleteToken(): DeleteOAuthTokenInteractor {
        return new DeleteOAuthTokenInteractor(new DeleteAllInteractor(this.tokenRepository()));
    }

    private getClient(): GetOAuthClientInteractor {
        return new GetOAuthClientInteractor(new GetInteractor(this.clientRepository()));
    }

    private getToken(): GetOAuthTokenInteractor {
        return new GetOAuthTokenInteractor(new GetInteractor(this.tokenRepository()));
    }

    private getRefreshToken(): GetOAuthRefreshTokenInteractor {
        return new GetOAuthRefreshTokenInteractor(new GetInteractor(this.tokenRepository()));
    }

    private getUserInfo(): GetOAuthUserInfoInteractor {
        return new GetOAuthUserInfoInteractor(
            new GetInteractor(this.tokenRepository()),
            new GetInteractor(this.userInfoRepository()),
        );
    }

    private putToken(): PutOAuthTokenInteractor {
        return new PutOAuthTokenInteractor(
            new PutInteractor(this.tokenRepository()),
            new PutInteractor(this.userInfoRepository()),
        );
    }

    private clientRepository(): OAuthClientRepository {
        const clientRawDataSource = new RawSQLDataSource(
            this.sqlDialect,
            this.sqlInterface,
            OAuthClientTableName,
            [OAuthClientColumnClientId, OAuthClientColumnClientSecret,
                OAuthClientColumnAccessTokenLifetime, OAuthClientColumnRefreshTokenLifetime],
        );
        const clientDataSource = new DataSourceMapper(
            clientRawDataSource, clientRawDataSource, clientRawDataSource,
            new OAuthClientRawSqlToEntityMapper(), new OAuthClientEntityToRawSqlMapper(),
        );
        const clientGrantsRawDataSource = new RawSQLDataSource(
            this.sqlDialect,
            this.sqlInterface,
            OAuthClientGrantTableName,
            [OAuthClientGrantColumnClientId, OAuthClientGrantColumnGrantName],
        );
        const clientGrantsDataSource = new DataSourceMapper(
            clientGrantsRawDataSource, clientGrantsRawDataSource, clientGrantsRawDataSource,
            new OAuthClientGrantRawSqlToEntityMapper(), new OAuthClientGrantEntityToRawSqlMapper(),
        );
        return new OAuthClientRepository(
            clientDataSource, clientDataSource, clientDataSource,
            clientGrantsDataSource, clientGrantsDataSource, clientGrantsDataSource,
        );
    }

    private tokenRepository(): OAuthTokenRepository {
        const tokenRawDataSource = new RawSQLDataSource(
            this.sqlDialect,
            this.sqlInterface,
            OAuthTokenTableName,
            [OAuthTokenColumnAccessToken, OAuthTokenColumnAccessTokenExpiresAt,
                OAuthTokenColumnRefreshToken, OAuthTokenColumnRefreshTokenExpiresAt,
                OAuthTokenColumnClientId],
        );
        const tokenDataSource = new DataSourceMapper(
            tokenRawDataSource, tokenRawDataSource, tokenRawDataSource,
            new OAuthTokenRawSqlToEntityMapper(), new OAuthTokenEntityToRawSqlMapper(),
        );

        const tokenScopeRawDataSource = new RawSQLDataSource(
            this.sqlDialect,
            this.sqlInterface,
            OAuthTokenScopeTableName,
            [OAuthTokenScopeColumnScope, OAuthTokenScopeColumnTokenId],
        );
        const tokenScopeDataSource = new DataSourceMapper(
            tokenScopeRawDataSource, tokenScopeRawDataSource, tokenScopeRawDataSource,
            new OAuthTokenScopeRawSqlToEntityMapper(), new OAuthTokenScopeEntityToRawSqlMapper(),
        );

        return new OAuthTokenRepository(
            this.clientRepository(),
            tokenDataSource, tokenDataSource, tokenDataSource,
            tokenScopeDataSource, tokenScopeDataSource, tokenScopeDataSource,
        );
    }

    private userInfoRepository(): RepositoryMapper<OAuthUserInfoEntity, OAuthUserInfoModel> {
        const rawDataSource = new RawSQLDataSource(
            this.sqlDialect,
            this.sqlInterface,
            OAuthUserInfoTableName,
            [OAuthUserInfoColumnTokenId, OAuthUserInfoColumnUserId],
        );
        const dataSource = new DataSourceMapper(
            rawDataSource, rawDataSource, rawDataSource,
            new OAuthUserInfoRawSqlToEntityMapper(),
            new OAuthUserInfoEntityToRawSqlMapper(),
        );
        const baseRepository = new SingleDataSourceRepository(dataSource, dataSource, dataSource);
        return new RepositoryMapper(
            baseRepository, baseRepository, baseRepository,
            new OAuthUserInfoEntityToModelMapper(),
            new OAuthUserInfoModelToEntityMapper(),
        );
    }
}
