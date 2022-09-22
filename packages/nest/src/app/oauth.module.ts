import { DynamicModule, Module } from '@nestjs/common';
import { SQLDialect, SQLInterface } from '@mobilejazz/harmony-core';
import OAuth2Server = require('oauth2-server');

import { DatabaseModule } from './database.module';
import { AuthControllerInteractor, GetOAuthUserInteractor, LoginOAuthUserInteractor, OAuth2GuardInteractor, OAuthSQLProvider, ValidateScopeInteractor } from '../oauth';

// See: https://stackoverflow.com/a/52183279/379923
interface Type<T> extends Function { new (...args: unknown[]): T; }

export interface OAuthModuleParams {
    getUser: Type<GetOAuthUserInteractor>;
    loginUser: Type<LoginOAuthUserInteractor>;
    validateScope: Type<ValidateScopeInteractor>;
}

@Module({})
export class OAuthModule {
    static forRoot(params: OAuthModuleParams): DynamicModule {
        return {
            global: true,
            module: OAuthModule,
            imports: [
                DatabaseModule,
                // OauthUserInfoModule,
                // forwardRef(() => UserModule),
            ],
            providers: [
                {
                    provide: OAuth2Server,
                    inject: ['SQLDialect', 'SQLInterface', params.getUser, params.loginUser, params.validateScope],
                    useFactory: (
                        dialect: SQLDialect,
                        sqlInterface: SQLInterface,
                        getUser: GetOAuthUserInteractor,
                        loginUser: LoginOAuthUserInteractor,
                        validateScope: ValidateScopeInteractor,
                    ) => {
                        const oneHourInSeconds = 60 * 60;
                        const provider = new OAuthSQLProvider(dialect, sqlInterface);

                        return new OAuth2Server({
                            model: provider.userModel(getUser, loginUser, validateScope),
                            // In seconds:
                            accessTokenLifetime: oneHourInSeconds,
                            refreshTokenLifetime: oneHourInSeconds * 8,
                            allowBearerTokensInQueryString: true,
                        });
                    },
                },
                {
                    provide: OAuth2GuardInteractor,
                    inject: [OAuth2Server],
                    useFactory: (server: OAuth2Server) => new OAuth2GuardInteractor(server),
                },
                {
                    provide: AuthControllerInteractor,
                    inject: [OAuth2Server],
                    useFactory: (server: OAuth2Server) => new AuthControllerInteractor(server),
                },
            ],
            exports: [AuthControllerInteractor, OAuth2GuardInteractor],
        };
    }
}
