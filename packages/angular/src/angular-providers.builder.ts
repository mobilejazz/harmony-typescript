/* eslint-disable @typescript-eslint/no-explicit-any */
import { FactoryProvider, Provider } from '@angular/core';
import { Type } from '@mobilejazz/harmony-core';

// Anything instanciable, including abstract classes
type AnyType = abstract new (...args: any[]) => any;

// Map a tuple/array of `AbstractClassType[]` to `InstanceType[]`
// See: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-1.html#mapped-types-on-tuples-and-arrays
// See: https://www.reddit.com/r/typescript/comments/us0qe9/how_do_you_write_a_generic_type_that_converts_a/
type InstanceTypeList<T extends [...AnyType[]]> = {
    [K in keyof T]: T[K] extends AnyType ? InstanceType<T[K]> : T[K];
};

// Function that given `T` returns `U`
type FactoryFn<T extends AnyType, U, ExtraDeps extends AnyType[]> = (
    p: InstanceType<T>,
    ...args: InstanceTypeList<ExtraDeps>
) => U;

// Dependencies tuple/array
// This is basically used in `add()` to "transfer" the types to `FactoryFn`
type Deps<T, U extends AnyType[]> = [T] | [T, ...U];

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
    public add<U, ExtraDeps extends AnyType[]>(
        provide: Type<U>,
        useFactory: FactoryFn<T, U, ExtraDeps>,
        deps: Deps<T, ExtraDeps> = [this.provider.provide],
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
