/**
 * Instanciable `class`, anything you can call with `new` and get a new instance.
 * @see https://stackoverflow.com/a/52183279/379923
 */
export interface Type<T> extends Function {
    new (...args: unknown[]): T;
}

/**
 * Loose type that represents a Harmony Provider.
 *
 * Needed as a _helper type_ for Angular/Nest `*ProviderModule` helpers.
 */
export type HarmonyProvider = Record<`provide${string}`, () => unknown>;
