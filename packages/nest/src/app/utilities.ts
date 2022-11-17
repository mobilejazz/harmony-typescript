import { HarmonyProvider } from '@mobilejazz/harmony-core';
import { FactoryProvider, ModuleMetadata, Provider, Type } from '@nestjs/common';

export function createNestProviderModuleMetadata(provider: FactoryProvider, interactors: Type[]): ModuleMetadata {
    const providers: Provider[] = [provider];

    interactors.forEach((interactor) => {
        const method = `provide${interactor.name.replace('Interactor', '')}`;

        providers.push({
            provide: interactor,
            inject: [provider.provide],
            useFactory: (providerInstance: HarmonyProvider) => providerInstance[method](),
        });
    });

    return {
        providers,
        exports: [provider.provide, ...interactors],
    };
}
