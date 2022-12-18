import { Provider, FactoryProvider, Type } from '@angular/core';
import { HarmonyProvider, DataSourceMapper, DefaultNetworkDataSource } from '@mobilejazz/harmony-core';
import { ApiRequestService } from './data/api-request.service';

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

export function getDefaultNetworkDataSourceMapper<T>(requestService: ApiRequestService): DataSourceMapper<T> {
    const dataSource = new DefaultNetworkDataSource<T>(requestService);
    return new DataSourceMapper<T>(dataSource);
}
