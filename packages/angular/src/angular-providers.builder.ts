/* eslint-disable @typescript-eslint/no-explicit-any */
import { FactoryProvider, Provider } from '@angular/core';
import { AnyType, Type } from '@mobilejazz/harmony-core';

// Function that given `T` returns `U`
type FactoryFn<T extends AnyType, U> = (p: InstanceType<T>, ...args: any[]) => U;

// Angular provider for the Harmony provider
interface HarmonyFactoryProvider<T extends AnyType> extends FactoryProvider {
    provide: T;
    useFactory: (...args: any[]) => InstanceType<T>;
}

class AngularProvidersBuilder<T extends AnyType> {
    private readonly providers: Provider[] = [];

    constructor(private readonly provider: HarmonyFactoryProvider<T>) {
        this.providers.push(this.provider);
    }

    /**
     * Adds a provider
     *
     * Simple usage:
     * ```ts
     * .add(GetUserInteractor, (p) => p.provideGetUser())
     * ```
     *
     * Extra dependencies:
     * ```ts
     * .add(
     *   GetBarInteractor,
     *   (p, foo) => p.provideGetBar(foo),
     *   [AuthProvider, Foo],
     * )
     * ```
     *
     * @param provide Class to add to the provider
     * @param useFactory Factory function that creates the class instance
     * @param deps Extra deps for the provider
     */
    public add<U>(
        provide: Type<U>,
        useFactory: FactoryFn<T, U>,
        deps: [T, ...any[]] = [this.provider.provide],
    ): AngularProvidersBuilder<T> {
        this.providers.push({ provide, deps, useFactory });
        return this;
    }

    /**
     * Builds the Angular providers array
     * @returns Angular compatible `Provider[]`
     */
    public build(): Provider[] {
        return this.providers;
    }
}

export function angularProvidersBuilder<T extends AnyType>(
    provider: HarmonyFactoryProvider<T>,
): AngularProvidersBuilder<T> {
    return new AngularProvidersBuilder(provider);
}
