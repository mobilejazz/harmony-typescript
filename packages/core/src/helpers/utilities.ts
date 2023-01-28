type MethodDecorator = (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) => void;

/**
 * `@Cached()` decorator cache
 *
 * First key is the instance. So different instances from the same class
 * will have a separate entry on the map. The second level key is the method name.
 */
const cachedDecoratorCache: Map<unknown, Map<string, unknown>> = new Map();

/**
 * Caches the return value from a method and reuses it in subsequent calls
 */
export function Cached(): MethodDecorator {
    return function (instance: unknown, propertyName: string, descriptor: PropertyDescriptor): void {
        const method = descriptor.value;

        // Override the method with a decorator/wrapper that adds the cache logic
        descriptor.value = function () {
            if (!cachedDecoratorCache.has(instance)) {
                cachedDecoratorCache.set(instance, new Map());
            }

            // SAFETY `!`: We have just initialized the `instanceCache` above.
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const instanceCache = cachedDecoratorCache.get(instance)!;

            if (!instanceCache.has(propertyName)) {
                instanceCache.set(propertyName, method.apply(this));
            }

            return instanceCache.get(propertyName);
        };
    };
}

export class UnreachableCaseError extends Error {
    constructor(val: never) {
        super(`Unreachable case: ${JSON.stringify(val)}`);
    }
}
