import { SQLDialect, SQLInterface } from '@mobilejazz/harmony-core';
import { createNestProviders } from '@mobilejazz/harmony-nest';
import { Global, Module } from '@nestjs/common';

import { AppDefaultProvider, AppProvider } from 'src/domain/app.provider';
import { GetBasicUserInteractor } from './interactors/auth/get-basic-user.interactor';
import { LoginUserInteractor } from './interactors/auth/login-user.interactor';
import { ValidateUserScopeInteractor } from './interactors/auth/validate-user-scope.interactor';

const interactors = [
    GetBasicUserInteractor,
    LoginUserInteractor,
    ValidateUserScopeInteractor,
];

@Global()
@Module({
    providers: [
        {
            provide: AppProvider,
            inject: ['SQLDialect', 'SQLInterface'],
            useFactory: (dialect: SQLDialect, db: SQLInterface) =>
                new AppDefaultProvider(dialect, db),
        },
        ...createNestProviders(AppProvider, interactors),
    ],
    exports: [AppProvider, ...interactors],
})
export class AppProviderModule {}
