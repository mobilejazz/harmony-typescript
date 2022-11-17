import { SQLDialect, SQLInterface } from '@mobilejazz/harmony-core';
import { createNestProviderModuleMetadata } from '@mobilejazz/harmony-nest';
import { Global, Module } from '@nestjs/common';

import { AppDefaultProvider, AppProvider } from 'src/domain/app.provider';
import { GetBasicUserInteractor } from './interactors/auth/get-basic-user.interactor';
import { LoginUserInteractor } from './interactors/auth/login-user.interactor';
import { ValidateUserScopeInteractor } from './interactors/auth/validate-user-scope.interactor';
@Global()
@Module(
    createNestProviderModuleMetadata(
        {
            provide: AppProvider,
            inject: [SQLDialect, SQLInterface],
            useFactory: (dialect: SQLDialect, db: SQLInterface) =>
                new AppDefaultProvider(dialect, db),
        },
        [
            GetBasicUserInteractor,
            LoginUserInteractor,
            ValidateUserScopeInteractor,
        ],
    ),
)
export class AppProviderModule {}
