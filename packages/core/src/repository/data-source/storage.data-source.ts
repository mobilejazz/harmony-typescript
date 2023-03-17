import {
    DeleteError,
    FailedError,
    NotFoundError,
    KeyListQuery,
    KeyQuery,
    Query,
    QueryNotSupportedError,
    InvalidArgumentError,
} from '..';
import { DataSource } from './data-source';
import { Logger, SafeStorage, VoidLogger } from '../../helpers';

export class StorageDataSource implements DataSource<string> {
    private readonly storage: Storage;

    /**
     * @param storage Any instance of `Storage`, usually `localStorage` or `sessionStorage`
     * @param enableSafeMode Wrap the given `storage` in `SafeStorage`. This prevents errors in incognito and permission-less scenarios. Keep in mind that `SafeStorage` fallbacks to an **in-memory implementation**. If you need more control on how to handle incognito/permission issues then you should set this to `false` and handle these issues in a Repository. More info: https://michalzalecki.com/why-using-localStorage-directly-is-a-bad-idea/
     * @param logger Logger instance, defaults to `VoidLogger` (no logger)
     */
    constructor(storage: Storage, enableSafeMode: boolean, private readonly logger: Logger = new VoidLogger()) {
        this.storage = enableSafeMode ? new SafeStorage(storage) : storage;
    }

    private getItem(key: string): string {
        const item = this.storage.getItem(key);

        if (item === null) {
            throw new NotFoundError(`"${key}" not found in Storage`);
        }

        return item;
    }

    private getKeys(query: KeyQuery | KeyListQuery): string[] {
        let keys: string[];

        if (query instanceof KeyListQuery) {
            keys = query.keys;
        } else {
            keys = query.key.split(',');
        }

        return keys;
    }

    private setItem(key: string, value: string): void {
        try {
            this.storage.setItem(key, value);
        } catch (err) {
            // Handle `QuotaExceededError` (or others), with a generic Harmony error
            throw new FailedError(`Error while saving in Storage`);
        }
    }

    public async get(query: Query): Promise<string> {
        if (query instanceof KeyQuery) {
            return this.getItem(query.key);
        } else {
            throw new QueryNotSupportedError();
        }
    }

    public async put(value: string | undefined, query: Query): Promise<string> {
        if (typeof value === 'undefined') {
            throw new InvalidArgumentError(`StorageDataSource: value can't be undefined`);
        }

        if (query instanceof KeyQuery) {
            this.setItem(query.key, value);
            return this.getItem(query.key);
        } else {
            throw new QueryNotSupportedError();
        }
    }

    public async delete(query: Query): Promise<void> {
        if (query instanceof KeyQuery || query instanceof KeyListQuery) {
            const keys = this.getKeys(query);
            const results = keys.map<boolean>((key) => {
                this.storage.removeItem(key);
                return this.storage.getItem(key) === null;
            });

            if (results.indexOf(false) !== -1) {
                throw new DeleteError();
            }

            return;
        } else {
            throw new QueryNotSupportedError();
        }
    }
}
