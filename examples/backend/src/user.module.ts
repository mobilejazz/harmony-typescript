import {
  DataSourceMapper,
  DeleteDataSource,
  GetDataSource,
  GetInteractor,
  GetRepository,
  PutDataSource,
  RepositoryMapper,
  SingleDataSourceRepository,
  SQLDialect,
  SQLInterface,
} from '@mobilejazz/harmony-core';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@mobilejazz/harmony-nest';

import {
  UserEntityToSqlMapper,
  UserSqlToEntityMapper,
} from 'src/data/data-sources/mysql/mappers/user-sql.mapper';
import { UserMysqlDataSource } from 'src/data/data-sources/mysql/user.mysql.data-source';
import { UserEntity } from 'src/data/entities/user.entity';
import { GetBasicUserInteractor } from 'src/domain/interactors/user-auth/get-basic-user.interactor';
import {
  UserEntityToModelMapper,
  UserModelToEntityMapper,
} from 'src/domain/mappers/user.mapper';
import { UserModel } from 'src/domain/models/user.model';

@Module({
  controllers: [],
  imports: [
    DatabaseModule,
    // EmailModule,
    // forwardRef(() => OAuthModule),
    // OauthUserInfoModule,
    // PetitionBaseModule,
  ],
  providers: [
    {
      provide: 'DataSource<UserEntity>',
      inject: ['SQLDialect', 'SQLInterface'],
      useFactory: (dialect: SQLDialect, db: SQLInterface) => {
        const rawDataSource = new UserMysqlDataSource(dialect, db, true);

        return new DataSourceMapper(
          rawDataSource,
          rawDataSource,
          rawDataSource,
          new UserSqlToEntityMapper(),
          new UserEntityToSqlMapper(),
        );
      },
    },
    {
      provide: 'Repository<UserModel>',
      inject: ['DataSource<UserEntity>'],
      useFactory: (
        dataSource: GetDataSource<UserEntity> &
          PutDataSource<UserEntity> &
          DeleteDataSource,
      ) => {
        const repo = new SingleDataSourceRepository(
          dataSource,
          dataSource,
          dataSource,
        );

        return new RepositoryMapper(
          repo,
          repo,
          repo,
          new UserEntityToModelMapper(),
          new UserModelToEntityMapper(),
        );
      },
    },
    {
      provide: GetBasicUserInteractor,
      inject: ['Repository<UserModel>'],
      useFactory: (repo: GetRepository<UserModel>) =>
        new GetBasicUserInteractor(new GetInteractor(repo)),
    },
  ],
  exports: [GetBasicUserInteractor],
})
export class UserModule {}
