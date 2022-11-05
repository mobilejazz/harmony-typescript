import {
    CacheOperation,
    CacheRepository,
    CacheSyncOperation,
    DefaultObjectValidator,
    DefaultOperation,
    InMemoryDataSource,
    KeyQuery,
    MainOperation,
    MainSyncOperation,
    NotFoundError,
    Operation,
    OperationNotSupportedError,
    Query,
    QueryNotSupportedError,
} from '../../src';
import { Book, getDefaultBook, getRandomBook } from './BookHelper';

describe('CacheRepository', () => {
    let repository: CacheRepository<Book>;

    beforeEach(() => {
        const mainDataSource = new InMemoryDataSource<Book>();
        const cacheDataSource = new InMemoryDataSource<Book>();
        const validator = new DefaultObjectValidator();

        repository = new CacheRepository<Book>(
            mainDataSource,
            mainDataSource,
            mainDataSource,
            cacheDataSource,
            cacheDataSource,
            cacheDataSource,
            validator,
        );
    });

    describe('get', () => {
        it('should throw an error when a an unsupported operation is given', () => {
            const keyQuery = getDefaultKeyQuery();
            const notSupportedOperation = getNotSupportedOperation();

            const result = repository.get(keyQuery, notSupportedOperation);

            expect(result).rejects.toThrow(OperationNotSupportedError);
        });

        it('should return `undefined` when the key is not found', () => {
            const nonExistingKeyQuery = getMissingKeyQuery();
            const operation = getDefaultOperation();

            const result = repository.get(nonExistingKeyQuery, operation);

            expect(result).rejects.toThrow(NotFoundError);
        });

        it('should return the expected value when an existing is given', async () => {
            const query = getDefaultKeyQuery();
            const operation = getDefaultOperation();
            const book = getDefaultBook();
            await repository.put(book, query, operation);

            const result = await repository.get(query, operation);

            expect(result).toBe(book);
        });

        it('should read from the main datasource when using `MainOperation`', async () => {
            const query = getDefaultKeyQuery();
            const operation = getMainOperation();
            const book = getDefaultBook();
            await repository.put(book, query, operation);

            const result = await repository.get(query, operation);

            expect(result).toBe(book);
        });

        it('should read from the cache datasource when using `CacheOperation`', async () => {
            const query = getDefaultKeyQuery();
            const operation = getCacheOperation();
            const book = getDefaultBook();
            await repository.put(book, query, operation);

            const result = await repository.get(query, operation);

            expect(result).toBe(book);
        });
    });

    describe('put', () => {
        it('should throw an error when a an unsupported operation is given', async () => {
            const book = getDefaultBook();
            const keyQuery = getDefaultKeyQuery();
            const notSupportedOperation = getNotSupportedOperation();

            const result = repository.put(book, keyQuery, notSupportedOperation);

            expect(result).rejects.toThrowError(OperationNotSupportedError);
        });

        it('should return the given value on insertion', async () => {
            const book = getDefaultBook();
            const keyQuery = getDefaultKeyQuery();
            const operation = getDefaultOperation();

            const result = await repository.put(book, keyQuery, operation);

            expect(result).toBe(book);
        });

        it('should override the value when an already existing key is given', async () => {
            const query = getDefaultKeyQuery();
            const operation = getDefaultOperation();
            const bookOne = getDefaultBook();
            const bookTwo = getRandomBook();
            await repository.put(bookOne, query, operation);

            await repository.put(bookTwo, query, operation);
            const result = await repository.get(query, operation);

            expect(result).toBe(bookTwo);
        });

        it('should not update the cache when the `MainSyncOperation` fails', async () => {
            const book = getDefaultBook();
            const query = getNotSupportedQuery();
            const operation = getMainSyncOperation();

            const syncResult = repository.put(book, query, operation);
            const cacheResult = repository.get(getDefaultKeyQuery(), getCacheOperation());

            await expect(syncResult).rejects.toThrowError(QueryNotSupportedError);
            await expect(cacheResult).rejects.toThrowError(NotFoundError);
        });
    });

    describe('delete', () => {
        it('should throw an error when an unsupported operation is given', () => {
            const keyQuery = getDefaultKeyQuery();
            const notSupportedOperation = getNotSupportedOperation();

            const result = repository.delete(keyQuery, notSupportedOperation);

            expect(result).rejects.toThrowError(OperationNotSupportedError);
        });

        it('should return a value for a given key when the delete was performed on another key', async () => {
            const operation = getDefaultOperation();
            const queryExisting = getDefaultKeyQuery();
            const queryNotExisting = getMissingKeyQuery();
            const book = getDefaultBook();
            await repository.put(book, queryExisting, operation);

            await repository.delete(queryNotExisting, operation);
            const result = await repository.get(queryExisting, operation);

            expect(result).toBe(book);
        });

        it('should return `undefined` when a value is deleted', async () => {
            const operation = getDefaultOperation();
            const query = getDefaultKeyQuery();
            const book = getDefaultBook();
            await repository.put(book, query, operation);

            await repository.delete(query, operation);
            const result = repository.get(query, operation);

            expect(result).rejects.toThrowError(NotFoundError);
        });
    });
});

function getDefaultOperation(): Operation {
    return new DefaultOperation();
}

class WrongOperation implements Operation {}

function getNotSupportedOperation(): Operation {
    return new WrongOperation();
}

function getMainOperation(): Operation {
    return new MainOperation();
}

function getCacheOperation(): Operation {
    return new CacheOperation();
}

function getMainSyncOperation(): Operation {
    return new MainSyncOperation();
}

function getCacheSyncOperation(): Operation {
    return new CacheSyncOperation();
}

function getDefaultKeyQuery(): KeyQuery {
    return new KeyQuery('bookOne');
}

function getMissingKeyQuery(): KeyQuery {
    return new KeyQuery('Key that does not exist');
}

function getNotSupportedQuery(): Query {
    return new Query();
}
