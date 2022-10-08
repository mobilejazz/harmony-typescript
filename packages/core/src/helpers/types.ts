/**
 * Instanciable `class`, anything you can call with `new` and get a new instance.
 * @see https://stackoverflow.com/a/52183279/379923
 */
export interface Type<T> extends Function {
    new (...args: unknown[]): T;
}
