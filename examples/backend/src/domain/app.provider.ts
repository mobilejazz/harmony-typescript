import {
    Cached,
    DataSourceMapper,
    GetInteractor,
    GetRepositoryMapper,
    Repository,
    RepositoryMapper,
    SingleDataSourceRepository,
    SingleGetDataSourceRepository,
    SQLDialect,
    SQLInterface,
} from '@mobilejazz/harmony-core';
import {
    UserRawSQLDataToUserEntityMapper,
    UserEntityToUserRawSQLDataMapper,
} from 'src/data/data-sources/mysql/mappers/user-sql.mapper';

import { OauthUserInfoMysqlDataSource } from 'src/data/data-sources/mysql/oauth-user-info.mysql.data-source';
import { UserMysqlDataSource } from 'src/data/data-sources/mysql/user.mysql.data-source';
import { GetBasicUserInteractor } from './interactors/auth/get-basic-user.interactor';
import { LoginUserInteractor } from './interactors/auth/login-user.interactor';
import { ValidateUserScopeInteractor } from './interactors/auth/validate-user-scope.interactor';
import { UserModel } from './models/user.model';
import {
    OauthUserInfoEntityToModelMapper,
    UserEntityToModelMapper,
    UserModelToEntityMapper,
} from './mappers/user.mapper';

export abstract class AppProvider {
    abstract provideGetBasicUser(): GetBasicUserInteractor;
    abstract provideLoginUser(): LoginUserInteractor;
    abstract provideValidateUserScope(): ValidateUserScopeInteractor;
}

export class AppDefaultProvider implements AppProvider {
    constructor(
        private readonly dialect: SQLDialect,
        private readonly db: SQLInterface,
    ) {}

    @Cached()
    private getUserRepository(): Repository<UserModel> {
        const rawDataSource = new UserMysqlDataSource(
            this.dialect,
            this.db,
            true,
        );

        const dataSource = new DataSourceMapper(
            rawDataSource,
            rawDataSource,
            rawDataSource,
            new UserRawSQLDataToUserEntityMapper(),
            new UserEntityToUserRawSQLDataMapper(),
        );

        const singleRepo = new SingleDataSourceRepository(
            dataSource,
            dataSource,
            dataSource,
        );

        return new RepositoryMapper(
            singleRepo,
            singleRepo,
            singleRepo,
            new UserEntityToModelMapper(),
            new UserModelToEntityMapper(),
        );
    }

    public provideGetBasicUser(): GetBasicUserInteractor {
        return new GetBasicUserInteractor(
            new GetInteractor(this.getUserRepository()),
        );
    }

    public provideLoginUser(): LoginUserInteractor {
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

    public provideValidateUserScope(): ValidateUserScopeInteractor {
        return new ValidateUserScopeInteractor();
    }
}
