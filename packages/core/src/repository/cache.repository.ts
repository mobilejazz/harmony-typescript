import {DeleteRepository, GetRepository, PutRepository} from './repository';
import {IdQuery, IdsQuery, Query} from './query/query';
import {Operation, DefaultOperation} from './operation/operation';
import {MethodNotImplementedError, NotFoundError, NotValidError, OperationNotSupportedError} from './errors';
import {DeleteDataSource, GetDataSource, PutDataSource} from './data-source/data-source';

export class MainOperation implements  Operation {}
export class MainSyncOperation implements  Operation {}
export class CacheOperation implements Operation {}
export class CacheSyncOperation implements Operation {
    constructor(
        readonly fallback: ((error: Error) => boolean) = (() => false),
    ) {}
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

    get(query: Query, operation: Operation): Promise<T>;
    get<K>(id: K, operation: Operation): Promise<T>;
    get<K>(queryOrId: Query | K, operation: Operation = new DefaultOperation()): Promise<T> {
        let query: Query;
        if (queryOrId instanceof Query) {
            query = queryOrId;
        } else {
            query = new IdQuery(queryOrId);
        }

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
                        return Promise.reject(new NotFoundError());
                    }
                    if (!this.validator.isObjectValid(value)) {
                        return Promise.reject(new NotValidError());
                    }
                    return Promise.resolve(value);
                }).catch((err: Error) => {
                   if (err instanceof NotValidError || err instanceof NotFoundError) {
                        return this.get(query, new MainSyncOperation()).catch((finalError: Error) => {
                            let op = operation as CacheSyncOperation;
                            if (op.fallback(finalError)) {
                                return this.getCache.get(query);
                            } else {
                                return Promise.reject(finalError);
                            }
                        });
                   } else {
                       return Promise.reject(err);
                   }
                });
            default:
                return Promise.reject(new OperationNotSupportedError());
        }
    }

    getAll(query: Query, operation: Operation): Promise<T[]>;
    getAll<K>(ids: K[], operation: Operation): Promise<T[]>;
    getAll<K>(queryOrIds: Query | K[], operation: Operation = new DefaultOperation()): Promise<T[]> {
        let query: Query;
        if (queryOrIds instanceof Query) {
            query = queryOrIds;
        } else {
            query = new IdsQuery(queryOrIds);
        }

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
                        return Promise.reject(new NotFoundError());
                    }
                    if (!this.validator.isArrayValid(values)) {
                        return Promise.reject(new NotValidError());
                    }
                    return Promise.resolve(values);
                }).catch((err: Error) => {
                    if (err instanceof NotValidError || err instanceof NotFoundError) {
                        return this.getAll(query, new MainSyncOperation()).catch((finalError: Error) => {
                            let op = operation as CacheSyncOperation;
                            if (op.fallback(finalError)) {
                                return this.getCache.getAll(query);
                            } else {
                                return Promise.reject(finalError);
                            }
                        });
                    } else {
                        return Promise.reject(err);
                    }
                });
            default:
                return Promise.reject(new OperationNotSupportedError());
        }
    }

    put(value: T, query: Query, operation: Operation): Promise<T>;
    put<K>(value: T, id: K, operation: Operation): Promise<T>;
    put<K>(value: T, queryOrId: Query | K, operation: Operation = new DefaultOperation()): Promise<T> {
        let query: Query;
        if (queryOrId instanceof Query) {
            query = queryOrId;
        } else {
            query = new IdQuery(queryOrId);
        }
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
                return Promise.reject(new OperationNotSupportedError());
        }
    }

    putAll(values: T[], query: Query, operation: Operation): Promise<T[]>;
    putAll<K>(values: T[], ids: K[], operation: Operation): Promise<T[]>;
    putAll<K>(values: T[], queryOrIds: Query | K[], operation: Operation = new DefaultOperation()): Promise<T[]> {
        let query: Query;
        if (queryOrIds instanceof Query) {
            query = queryOrIds;
        } else {
            query = new IdsQuery(queryOrIds);
        }
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
                return Promise.reject(new OperationNotSupportedError());
        }
    }

    delete(query: Query, operation: Operation): Promise<void>;
    delete<K>(id: K, operation: Operation): Promise<void>;
    delete<K>(queryOrId: Query | K, operation: Operation = new DefaultOperation()): Promise<void> {
        let query: Query;
        if (queryOrId instanceof Query) {
            query = queryOrId;
        } else {
            query = new IdQuery(queryOrId);
        }
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
                return Promise.reject(new OperationNotSupportedError());
        }
    }

    deleteAll(query: Query, operation: Operation): Promise<void>;
    deleteAll<K>(ids: K[], operation: Operation): Promise<void>;
    deleteAll<K>(queryOrIds: Query | K[], operation: Operation = new DefaultOperation()): Promise<void> {
        let query: Query;
        if (queryOrIds instanceof Query) {
            query = queryOrIds;
        } else {
            query = new IdsQuery(queryOrIds);
        }
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
                return Promise.reject(new OperationNotSupportedError());
        }
    }
}
