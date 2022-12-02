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

/**
 * Given an array type `T[]`, removes the array part, leaving only `T`.
 * Note that it only handles one dimensional arrays, for multiple dimensions see: https://stackoverflow.com/a/74644590/379923
 *
 * @see https://stackoverflow.com/a/51399781/379923
 */
export type ArrayElement<MaybeArrayType> = MaybeArrayType extends readonly (infer ElementType)[]
    ? ElementType
    : MaybeArrayType;
