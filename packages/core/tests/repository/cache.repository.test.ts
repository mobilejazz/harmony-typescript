import {
    CacheRepository,
    DefaultObjectValidator,
    DefaultOperation,
    InMemoryDataSource,
    KeyQuery,
    Operation,
    OperationNotSupportedError,
} from '../../src';
import {Book, getDefaultBook, getRandomBook} from './BookHelper';

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
        it('On not supported Operation Throw Error', () => {
            expect.assertions(1);
            return expect(repository.get(getDefaultKeyQuery(), getNotSupportedOperation())).rejects.toThrow(OperationNotSupportedError);
        });

        it('On not existing Key return undefined', () => {
            expect.assertions(1);
            return expect(repository.get(getNotExistingKeyQuery(), getDefaultOperation())).resolves.toEqual(undefined);
        });

        it('On existing Key return the Value', () => {
            expect.assertions(1);
            const query = getDefaultKeyQuery();
            const operation = getDefaultOperation();
            const book = getDefaultBook();
            repository.put(book, query, operation);

            return expect(repository.get(query, operation)).resolves.toEqual(book);
        });
    });

    describe('put', () => {
        it('On not supported Operation Throw Error', () => {
            expect.assertions(1);
            return expect(repository.put(getDefaultBook(), getDefaultKeyQuery(), getNotSupportedOperation()))
                .rejects
                .toThrow(OperationNotSupportedError);
        });

        it('On put return the same value', () => {
            expect.assertions(1);
            const book = getDefaultBook();

            return expect(repository.put(book, getDefaultKeyQuery(), getDefaultOperation())).resolves.toEqual(book);
        });

        it('On existing key overwrite value', () => {
            expect.assertions(1);
            const query = getDefaultKeyQuery();
            const operation = getDefaultOperation();
            const bookOne = getDefaultBook();
            const bookTwo = getRandomBook();
            repository.put(bookOne, query, operation);
            repository.put(bookTwo, query, operation);

            return expect(repository.get(query, operation)).resolves.toEqual(bookTwo);
        });
    });

    describe('delete', () => {
        it('On not supported Operation Throw Error', () => {
            expect.assertions(1);
            return expect(repository.delete(getDefaultKeyQuery(), getNotSupportedOperation()))
                .rejects
                .toThrow(OperationNotSupportedError);
        });

        it('On not existing Key do nothing', () => {
            expect.assertions(1);
            const operation = getDefaultOperation();
            const queryExisting = getDefaultKeyQuery();
            const queryNotExisting = getNotExistingKeyQuery();
            const book = getDefaultBook();
            repository.put(book, queryExisting, operation);
            repository.delete(queryNotExisting, operation);

            return expect(repository.get(queryExisting, operation)).resolves.toEqual(book);
        });

        it('On existing key delete value', () => {
            expect.assertions(1);
            const operation = getDefaultOperation();
            const query = getDefaultKeyQuery();
            const book = getDefaultBook();
            repository.put(book, query, operation);
            repository.delete(query, operation);

            return expect(repository.get(query, operation)).resolves.toEqual(undefined);
        });
    });
});

function getDefaultOperation(): Operation {
    return new DefaultOperation();
}

class WrongOperation implements Operation {
}

function getNotSupportedOperation(): Operation {
    return new WrongOperation();
}

function getDefaultKeyQuery(): KeyQuery {
    return new KeyQuery('bookOne');
}

function getNotExistingKeyQuery(): KeyQuery {
    return new KeyQuery('some key that not exist');
}
