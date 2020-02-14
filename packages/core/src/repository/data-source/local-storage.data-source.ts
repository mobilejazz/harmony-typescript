import { DeleteError, KeyQuery, Query, QueryNotSupportedError } from '..';
import { DeleteDataSource, GetDataSource, PutDataSource } from './data-source';
import { Logger, DeviceConsoleLogger } from 'helpers';

export class LocalStorageDataSource  implements GetDataSource<string>, PutDataSource<string>, DeleteDataSource {
    constructor(
        private readonly logger: Logger = new DeviceConsoleLogger(),
    ) {}

    public async get(query: Query): Promise<string> {
        if (query instanceof KeyQuery) {
            return localStorage.getItem(query.key) as string;
        } else {
            throw new QueryNotSupportedError();
        }
    }

    public async getAll(query: Query): Promise<string[]> {
        if (query instanceof KeyQuery) {
            let keys = query.key.split(',');
            return keys.map((key: string) => localStorage.getItem(key) as string);
        } else {
            throw QueryNotSupportedError;
        }
    }

    public async put(value: string, query: Query): Promise<string> {
        if (query instanceof KeyQuery) {
            localStorage.setItem(query.key, value);
            return localStorage.getItem(query.key) as string;
        } else {
            throw QueryNotSupportedError;
        }
    }

    public async putAll(values: string[], query: Query): Promise<string[]> {
        if (query instanceof KeyQuery) {
            let keys = query.key.split(',');
            return keys.map((key, index) => {
                localStorage.setItem(key, values[index]);
                return localStorage.getItem(key) as string;
            });
        } else {
            throw QueryNotSupportedError;
        }
    }

    public async delete(query: Query): Promise<void> {
        if (query instanceof KeyQuery) {
            let keys = query.key.split(',');
            let result = keys.map(key => {
                localStorage.removeItem(key);
                return localStorage.getItem(key) === null;
            });

            if (result.indexOf(false) !== -1) {
                throw new DeleteError();
            }

            return;
        } else {
            throw QueryNotSupportedError;
        }
    }

    public async deleteAll(query: Query): Promise<void> {
        // tslint:disable-next-line:max-line-length
        this.logger.warning('[DEPRECATION] `deleteAll` will be deprecated. Calling `delete` instead.');
        return this.delete(query);
    }
}
