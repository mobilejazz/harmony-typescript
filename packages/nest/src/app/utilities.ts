import { FactoryProvider, InjectionToken, Provider, Type } from '@nestjs/common';

export function createNestProviders(provider: InjectionToken, interactors: Type[]): Provider[] {
    return interactors.map<FactoryProvider>(interactor => {
        const method = `get${interactor.name.replace('Interactor', '')}`;

        return {
            provide: interactor,
            inject: [provider],
            useFactory: (providerInstance) => providerInstance[method](),
        };
    });
}
