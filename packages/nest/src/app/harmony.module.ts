import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common';
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
    database?: DatabaseModuleParams;
    i18n?: I18nModuleParams;
    oAuth?: OAuthModuleParams;
}

@Module({})
export class HarmonyModule {
    static forRoot(params: HarmonyNestModuleParams): DynamicModule {
        const imports: ModuleMetadata['imports'] = [];

        if (params.database) {
            imports.push(DatabaseModule.forRoot(params.database));
        }

        if (params.i18n) {
            imports.push(
                I18nModule.forRoot({
                    fallbackLanguage: params.i18n.fallback,
                    fallbacks: params.i18n.fallbacks,
                    loaderOptions: {
                        path: params.i18n.path,
                        watch: true,
                    },
                    resolvers: [AcceptLanguageResolver],
                }),
            );
        }

        if (params.oAuth) {
            imports.push(OAuthModule.forRoot(params.oAuth));
        }

        return {
            global: true,
            module: HarmonyModule,
            imports,
        };
    }
}
