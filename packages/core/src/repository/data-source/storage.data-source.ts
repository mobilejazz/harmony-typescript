import { DeleteError, FailedError, NotFoundError, KeyListQuery, KeyQuery, Query, QueryNotSupportedError, InvalidArgumentError } from '..';
import { DeleteDataSource, GetDataSource, PutDataSource } from './data-source';
import { Logger, SafeStorage, VoidLogger } from '../../helpers';

export class StorageDataSource implements GetDataSource<string>, PutDataSource<string>, DeleteDataSource {
    private readonly storage: Storage;

    constructor(
        storage: Storage,
        private readonly logger: Logger = new VoidLogger(),
    ) {
        this.storage = new SafeStorage(storage);
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

    public async getAll(query: Query): Promise<string[]> {
        if (query instanceof KeyQuery || query instanceof KeyListQuery) {
            const keys = this.getKeys(query);
            return keys.map((key) => this.getItem(key));
        } else {
            throw QueryNotSupportedError;
        }
    }

    public async put(value: string, query: Query): Promise<string> {
        if (query instanceof KeyQuery) {
            this.setItem(query.key, value);
            return this.getItem(query.key);
        } else {
            throw QueryNotSupportedError;
        }
    }

    public async putAll(values: string[], query: Query): Promise<string[]> {
        if (query instanceof KeyQuery || query instanceof KeyListQuery) {
            const keys = this.getKeys(query);

            if (values.length !== keys.length) {
                throw new InvalidArgumentError(`Values lengh (${values.length}) and keys length (${keys.length}) don't match.`);
            }

            return keys.map((key, index) => {
                this.setItem(key, values[index]);
                return this.getItem(key);
            });
        } else {
            throw QueryNotSupportedError;
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
            throw QueryNotSupportedError;
        }
    }
}
