import { Provider, FactoryProvider, Type } from '@angular/core';
import { HarmonyProvider } from '@mobilejazz/harmony-core';

export function createAngularProviders(provider: FactoryProvider, interactors: Type<unknown>[]): Provider[] {
    const providers: Provider[] = [provider];

    interactors.forEach((interactor) => {
        const method = `provide${interactor.name.replace('Interactor', '')}`;

        providers.push({
            provide: interactor,
            deps: [provider.provide],
            useFactory: (providerInstance: HarmonyProvider) => providerInstance[method](),
        });
    });

    return providers;
}
