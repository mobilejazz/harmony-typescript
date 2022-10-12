import { Module } from '@nestjs/common';
import { join } from 'path';
import { HarmonyModule } from '@mobilejazz/harmony-nest';

import dataSource from '../config/database.data-source';
import { GetBasicUserInteractor } from '../domain/interactors/auth/get-basic-user.interactor';
import { ValidateUserScopeInteractor } from '../domain/interactors/auth/validate-user-scope.interactor';
import { LoginUserInteractor } from '../domain/interactors/auth/login-user.interactor';
import { AppProviderModule } from 'src/domain/app.provider.module';
import { AuthModule } from './features/auth/auth.module';

@Module({
    imports: [
        // Setup Harmony modules
        HarmonyModule.forRoot({
            database: {
                dataSource,
            },
            i18n: {
                fallback: 'en',
                fallbacks: { 'en-*': 'en' },
                path: join(__dirname, '/../assets/i18n/'),
            },
            oAuth: {
                getUser: GetBasicUserInteractor,
                validateScope: ValidateUserScopeInteractor,
                loginUser: LoginUserInteractor,
            },
        }),

        // App Modules
        AppProviderModule,
        AuthModule,
    ],
})
export class AppModule {}
