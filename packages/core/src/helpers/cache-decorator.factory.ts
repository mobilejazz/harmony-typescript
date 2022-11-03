export function CacheDecoratorFactory(cache: Map<string, unknown>) {
    return function CacheDecorator() {
        return function (_: unknown, propertyKey: string, descriptor: PropertyDescriptor): void {
            const method = descriptor.value;

            descriptor.value = function () {
                if (!cache.has(propertyKey)) {
                    cache.set(propertyKey, method.apply(this));
                }

                return cache.get(propertyKey);
            };
        };
    };
}
