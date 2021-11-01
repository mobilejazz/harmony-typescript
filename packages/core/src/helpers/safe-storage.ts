/**
 * SafeStorage
 *
 * Wraps any `Storage` implementation so in case that the `Storage` is not available
 * it uses an in memory implementation. Check the following article for more info on
 * why this is needed:
 * https://michalzalecki.com/why-using-localStorage-directly-is-a-bad-idea/
 */
export class SafeStorage implements Storage {
    private readonly isSupported: boolean;
    private inMemoryStorage: Record<string, string> = {};

    constructor (
        private readonly storage: Storage,
    ) {
        try {
            const testKey = 'gjsLwbKbR3rk7xqTKWt3iVHA9hoJHsyVcC9M6wNF';
            this.storage.setItem(testKey, testKey);
            this.storage.removeItem(testKey);
            this.isSupported = true;
        } catch (e) {
            this.isSupported = false;
        }
    }

    public clear(): void {
        if (this.isSupported) {
            this.storage.clear();
        } else {
            this.inMemoryStorage = {};
        }
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    public getItem(key: string): string | null {
        if (this.isSupported) {
            return this.storage.getItem(key);
        } else if (Object.prototype.hasOwnProperty.call(this.inMemoryStorage, key)) {
            return this.inMemoryStorage[key];
        }

        return null;
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    public key(index: number): string | null {
        if (this.isSupported) {
            return this.storage.key(index);
        } else {
            return Object.keys(this.inMemoryStorage)[index] ?? null;
        }
    }

    public removeItem(key: string): void {
        if (this.isSupported) {
            this.storage.removeItem(key);
        } else {
            delete this.inMemoryStorage[key];
        }
    }

    public setItem(key: string, value: string): void {
        if (this.isSupported) {
            this.storage.setItem(key, value);
        } else {
            this.inMemoryStorage[key] = String(value);
        }
    }

    public get length(): number {
        if (this.isSupported) {
            return this.storage.length;
        } else {
            return Object.keys(this.inMemoryStorage).length;
        }
    }
}
