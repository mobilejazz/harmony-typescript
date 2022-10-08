type MethodDecorator = (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) => void;
type CacheDecorator = () => MethodDecorator;

/**
 * Creates a `CacheDecorator`
 *
 * We don't expose directly `CacheDecorator` as we want to have a different
 * cache per class when this is used. Otherwise different classes would share
 * the same cache.
 *
 * @returns a `CacheDecorator` with unique cache
 */
export function createCacheDecorator(): CacheDecorator {
    const cache = new Map<string, unknown>();

    return function CacheDecorator(): MethodDecorator {
        return function (_target: unknown, propertyKey: string, descriptor: PropertyDescriptor): void {
            const method = descriptor.value;

            descriptor.value = function () {
                if (!cache.has(propertyKey)) {
                    cache.set(propertyKey, method.apply(this));
                }

                return cache.get(propertyKey);
            };
        }
    }
}

export class UnreachableCaseError extends Error {
    constructor(val: never) {
        super(`Unreachable case: ${JSON.stringify(val)}`);
    }
}
