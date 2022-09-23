import { DynamicModule, Module } from '@nestjs/common';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';

import { DatabaseModule, DatabaseModuleParams } from './database.module';
import { OAuthModule, OAuthModuleParams } from './oauth.module';

interface I18nModuleParams {
    fallback: string;
    fallbacks?: Record<string, string>;
    /** Path where locale folders are located (e.g. `en`), these folders will contain the JSON files, e.g.: `domain-error.json`. */
    path: string;
}

interface HarmonyNestModuleParams {
    database: DatabaseModuleParams;
    i18n: I18nModuleParams;
    oAuth: OAuthModuleParams;
}

@Module({})
export class HarmonyNestModule {
    static forRoot(params: HarmonyNestModuleParams): DynamicModule {
        return {
            global: true,
            module: HarmonyNestModule,
            imports: [
                DatabaseModule.forRoot(params.database),
                I18nModule.forRoot({
                    fallbackLanguage: params.i18n.fallback,
                    fallbacks: params.i18n.fallbacks,
                    loaderOptions: {
                        path: params.i18n.path,
                        watch: true,
                    },
                    resolvers: [AcceptLanguageResolver],
                }),
                OAuthModule.forRoot(params.oAuth),
            ],
        };
    }
}
