/**
 * Instanciable `class`, anything you can call with `new` and get a new instance.
 * @see https://stackoverflow.com/a/52183279/379923
 */
export interface Type<T> extends Function {
    // In this case, it must be `any`. Using `unknown` give compile errors.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new (...args: any[]): T;
}

/**
 * Loose type that represents a Harmony Provider.
 *
 * Needed as a _helper type_ for Angular/Nest `*ProviderModule` helpers.
 */
export type HarmonyProvider = Record<`provide${string}`, () => unknown>;
