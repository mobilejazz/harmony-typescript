import {DeleteRepository, GetRepository, PutRepository} from './repository';
import {IdQuery, IdsQuery, Query} from './query/query';
import {Operation, DefaultOperation} from './operation/operation';
import {MethodNotImplementedError, NotFoundError, NotValidError, OperationNotSupportedError} from './errors';
import {DeleteDataSource, GetDataSource, PutDataSource} from './data-source/data-source';

export class MainOperation implements  Operation {}
export class MainSyncOperation implements  Operation {}
export class CacheOperation implements Operation {}
export class CacheSyncOperation implements Operation {
    constructor(readonly fallback: ((error: Error) => boolean) = (() => false)) {}
}

export interface ObjectValidator {
    isObjectValid<T>(object: T): boolean;
    isArrayValid<T>(array: T[]): boolean;
}

export class DefaultObjectValidator implements ObjectValidator {
    isObjectValid<T>(object: T): boolean {
        return true;
    }
    isArrayValid<T>(array: T[]): boolean {
        if (array.length === 0) {
            return false;
        }
        for (let element of array) {
            if (!this.isObjectValid(element)) {
                return false;
            }
        }
        return true;
    }
}

export class CacheRepository<T> implements GetRepository<T>, PutRepository<T>, DeleteRepository {

    constructor(
        private readonly getMain: GetDataSource<T>,
        private readonly putMain: PutDataSource<T>,
        private readonly deleteMain: DeleteDataSource,
        private readonly getCache: GetDataSource<T>,
        private readonly putCache: PutDataSource<T>,
        private readonly deleteCache: DeleteDataSource,
        private readonly validator: ObjectValidator,
    ) {}

    public async get(query: Query, operation: Operation): Promise<T> {
        switch (operation.constructor) {
            case DefaultOperation:
                return this.get(query, new CacheSyncOperation());
            case MainOperation:
                return this.getMain.get(query);
            case CacheOperation:
                return this.getCache.get(query);
            case MainSyncOperation:
                return this.getMain.get(query).then((value: T) => {
                    return this.putCache.put(value, query);
                });
            case CacheSyncOperation:
                return this.getCache.get(query).then((value: T) => {
                    if (value == null) {
                        throw new NotFoundError();
                    }
                    if (!this.validator.isObjectValid(value)) {
                        throw new NotValidError();
                    }
                    return value;
                }).catch((err: Error) => {
                   if (err instanceof NotValidError || err instanceof NotFoundError) {
                        return this.get(query, new MainSyncOperation()).catch((finalError: Error) => {
                            let op = operation as CacheSyncOperation;
                            if (op.fallback(finalError)) {
                                return this.getCache.get(query);
                            } else {
                                throw finalError;
                            }
                        });
                   } else {
                       throw err;
                   }
                });
            default:
                throw new OperationNotSupportedError();
        }
    }

    public async getAll(query: Query, operation: Operation): Promise<T[]> {
        switch (operation.constructor) {
            case DefaultOperation:
                return this.getAll(query, new CacheSyncOperation());
            case MainOperation:
                return this.getMain.getAll(query);
            case CacheOperation:
                return this.getCache.getAll(query);
            case MainSyncOperation:
                return this.getMain.getAll(query).then((values: T[]) => {
                    return this.putCache.putAll(values, query);
                });
            case CacheSyncOperation:
                return this.getCache.getAll(query).then((values: T[]) => {
                    if (values == null) {
                        throw new NotFoundError();
                    }
                    if (!this.validator.isArrayValid(values)) {
                        throw new NotValidError();
                    }
                    return values;
                }).catch((err: Error) => {
                    if (err instanceof NotValidError || err instanceof NotFoundError) {
                        return this.getAll(query, new MainSyncOperation()).catch((finalError: Error) => {
                            let op = operation as CacheSyncOperation;
                            if (op.fallback(finalError)) {
                                return this.getCache.getAll(query);
                            } else {
                                throw finalError;
                            }
                        });
                    } else {
                        throw err;
                    }
                });
            default:
                throw new OperationNotSupportedError();
        }
    }

    public async put(value: T, query: Query, operation: Operation): Promise<T> {
        switch (operation.constructor) {
            case DefaultOperation:
                return this.put(value, query, new MainSyncOperation());
            case MainOperation:
                return this.putMain.put(value, query);
            case CacheOperation:
                return this.putCache.put(value, query);
            case MainSyncOperation:
                return this.putMain.put(value, query).then((val: T) => {
                    return this.putCache.put(val, query);
                });
            case CacheSyncOperation:
                return this.putCache.put(value, query).then((val: T) => {
                    return this.putMain.put(val, query);
                });
            default:
                throw new OperationNotSupportedError();
        }
    }

    public async putAll(values: T[], query: Query, operation: Operation): Promise<T[]> {
        switch (operation.constructor) {
            case DefaultOperation:
                return this.putAll(values, query, new MainSyncOperation());
            case MainOperation:
                return this.putMain.putAll(values, query);
            case CacheOperation:
                return this.putCache.putAll(values, query);
            case MainSyncOperation:
                return this.putMain.putAll(values, query).then((array: T[]) => {
                    return this.putCache.putAll(array, query);
                });
            case CacheSyncOperation:
                return this.putCache.putAll(values, query).then((array: T[]) => {
                    return this.putMain.putAll(array, query);
                });
            default:
                throw new OperationNotSupportedError();
        }
    }

    public async delete(query: Query, operation: Operation): Promise<void> {
        switch (operation.constructor) {
            case DefaultOperation:
                return this.delete(query, new MainSyncOperation());
            case MainOperation:
                return this.deleteMain.delete(query);
            case CacheOperation:
                return this.deleteCache.delete(query);
            case MainSyncOperation:
                return this.deleteMain.delete(query).then(() => {
                    return this.deleteCache.delete(query);
                });
            case CacheSyncOperation:
                return this.deleteCache.delete(query).then(() => {
                    return this.deleteMain.delete(query);
                });
            default:
                throw new OperationNotSupportedError();
        }
    }

    public async deleteAll(query: Query, operation: Operation): Promise<void> {
        // tslint:disable-next-line:max-line-length
        console.warn('[DEPRECATION] `deleteAll` will be deprecated. Use `delete` instead.');

        switch (operation.constructor) {
            case DefaultOperation:
                return this.deleteAll(query, new MainSyncOperation());
            case MainOperation:
                return this.deleteMain.deleteAll(query);
            case CacheOperation:
                return this.deleteCache.deleteAll(query);
            case MainSyncOperation:
                return this.deleteMain.deleteAll(query).then(() => {
                    return this.deleteCache.deleteAll(query);
                });
            case CacheSyncOperation:
                return this.deleteCache.deleteAll(query).then(() => {
                    return this.deleteMain.deleteAll(query);
                });
            default:
                throw new OperationNotSupportedError();
        }
    }
}
