import {
    DataSourceMapper,
    GetInteractor,
    GetRepositoryMapper,
    RepositoryMapper,
    SingleDataSourceRepository,
    SingleGetDataSourceRepository,
    SQLDialect,
    SQLInterface,
} from '@mobilejazz/harmony-core';
import {
    UserSqlToEntityMapper,
    UserEntityToSqlMapper,
} from 'src/data/data-sources/mysql/mappers/user-sql.mapper';

import { OauthUserInfoMysqlDataSource } from 'src/data/data-sources/mysql/oauth-user-info.mysql.data-source';
import { UserMysqlDataSource } from 'src/data/data-sources/mysql/user.mysql.data-source';
import { GetBasicUserInteractor } from './interactors/auth/get-basic-user.interactor';
import { LoginUserInteractor } from './interactors/auth/login-user.interactor';
import { ValidateUserScopeInteractor } from './interactors/auth/validate-user-scope.interactor';
import {
    OauthUserInfoEntityToModelMapper,
    UserEntityToModelMapper,
    UserModelToEntityMapper,
} from './mappers/user.mapper';

export abstract class AppProvider {
    abstract getGetBasicUser(): GetBasicUserInteractor;
    abstract getLoginUser(): LoginUserInteractor;
    abstract getValidateUserScope(): ValidateUserScopeInteractor;
}

export class AppDefaultProvider implements AppProvider {
    constructor(
        private readonly dialect: SQLDialect,
        private readonly db: SQLInterface,
    ) {}

    public getGetBasicUser(): GetBasicUserInteractor {
        const rawDataSource = new UserMysqlDataSource(
            this.dialect,
            this.db,
            true,
        );
        const dataSource = new DataSourceMapper(
            rawDataSource,
            rawDataSource,
            rawDataSource,
            new UserSqlToEntityMapper(),
            new UserEntityToSqlMapper(),
        );

        const singleRepo = new SingleDataSourceRepository(
            dataSource,
            dataSource,
            dataSource,
        );
        const repo = new RepositoryMapper(
            singleRepo,
            singleRepo,
            singleRepo,
            new UserEntityToModelMapper(),
            new UserModelToEntityMapper(),
        );

        return new GetBasicUserInteractor(new GetInteractor(repo));
    }

    public getLoginUser(): LoginUserInteractor {
        const dataSource = new OauthUserInfoMysqlDataSource(
            this.dialect,
            this.db,
        );
        const repo = new GetRepositoryMapper(
            new SingleGetDataSourceRepository(dataSource),
            new OauthUserInfoEntityToModelMapper(),
        );

        return new LoginUserInteractor(new GetInteractor(repo));
    }

    public getValidateUserScope(): ValidateUserScopeInteractor {
        return new ValidateUserScopeInteractor();
    }
}
