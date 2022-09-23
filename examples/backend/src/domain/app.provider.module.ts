import { SQLDialect, SQLInterface } from '@mobilejazz/harmony-core';
import { Global, Module } from '@nestjs/common';

import { AppDefaultProvider, AppProvider } from 'src/domain/app.provider';
import { GetBasicUserInteractor } from './interactors/user-auth/get-basic-user.interactor';
import { LoginUserInteractor } from './interactors/user-auth/login-user.interactor';
import { ValidateUserScopeInteractor } from './interactors/user-auth/validate-user-scope.interactor';

@Global()
@Module({
  providers: [
    {
      provide: AppProvider,
      inject: ['SQLDialect', 'SQLInterface'],
      useFactory: (dialect: SQLDialect, db: SQLInterface) =>
        new AppDefaultProvider(dialect, db),
    },
    {
      provide: GetBasicUserInteractor,
      inject: [AppProvider],
      useFactory: (provider: AppProvider) => provider.getGetBasicUser(),
    },
    {
      provide: LoginUserInteractor,
      inject: [AppProvider],
      useFactory: (provider: AppProvider) => provider.getLoginUser(),
    },
    {
      provide: ValidateUserScopeInteractor,
      inject: [AppProvider],
      useFactory: (provider: AppProvider) => provider.getValidateUserScope(),
    },
  ],
  exports: [
    AppProvider,
    GetBasicUserInteractor,
    LoginUserInteractor,
    ValidateUserScopeInteractor,
  ],
})
export class AppProviderModule {}
