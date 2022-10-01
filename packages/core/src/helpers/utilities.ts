type CacheDecorator = {
    (): ((target: unknown, propertyKey: string, descriptor: PropertyDescriptor) => void);
    cache: Map<string, unknown>;
};

export function createCacheDecorator(): CacheDecorator {
    const cache = new Map<string, unknown>();
    const decorator = function CacheDecorator() {
        return function (_: unknown, propertyKey: string, descriptor: PropertyDescriptor): void {
            const method = descriptor.value;

            descriptor.value = function () {
                if (!cache.has(propertyKey)) {
                    cache.set(propertyKey, method.apply(this));
                }

                return cache.get(propertyKey);
            };
        }
    }

    // Expose the `Map` cache
    decorator.cache = cache;

    return decorator;
}

export class UnreachableCaseError extends Error {
    constructor(val: never) {
        super(`Unreachable case: ${JSON.stringify(val)}`);
    }
}
