import {InMemoryDataSource, KeyQuery, Query, QueryNotSupportedError} from '../../../src';
import {Book, getDefaultBook, getRandomBook} from '../BookHelper';

describe('InMemoryDataSource', () => {
    let dataSource: InMemoryDataSource<Book>;

    beforeEach(() => {
        dataSource = new InMemoryDataSource<Book>();
    });

    describe('get', () => {
        it('On not supported Query Throw Error', () => {
            expect.assertions(1);
            return expect(dataSource.get(getNotSupportedQuery())).rejects.toThrow(QueryNotSupportedError);
        });

        it('On not existing Key return undefined', () => {
            expect.assertions(1);
            const query = getNotExistingKeyQuery();

            return expect(dataSource.get(query)).resolves.toEqual(undefined);
        });

        it('On existing Key return the Value', () => {
            expect.assertions(1);
            const query = getDefaultKeyQuery();
            const book = getDefaultBook();
            dataSource.put(book, query);

            return expect(dataSource.get(query)).resolves.toEqual(book);
        });
    });

    describe('put', () => {
        it('On not supported Query Throw Error', () => {
            expect.assertions(1);
            const book = getDefaultBook();
            return expect(dataSource.put(book, getNotSupportedQuery())).rejects.toThrow(QueryNotSupportedError);
        });

        it('On put return the same value', () => {
            expect.assertions(1);
            const query = getDefaultKeyQuery();
            const book = getDefaultBook();

            return expect(dataSource.put(book, query)).resolves.toEqual(book);
        });

        it('On existing key overwrite value', () => {
            expect.assertions(1);
            const query = getDefaultKeyQuery();
            const bookOne = getDefaultBook();
            const bookTwo = getRandomBook();
            dataSource.put(bookOne, query);
            dataSource.put(bookTwo, query);

            return expect(dataSource.get(query)).resolves.toEqual(bookTwo);
        });
    });

    describe('delete', () => {
        it('On not supported Query Throw Error', () => {
            expect.assertions(1);
            const query = getNotSupportedQuery();
            return expect(dataSource.delete(query)).rejects.toThrow(QueryNotSupportedError);
        });

        it('On not existing Key do nothing', () => {
            expect.assertions(1);
            const queryExisting = getDefaultKeyQuery();
            const queryNotExisting = getNotExistingKeyQuery();
            const book = getDefaultBook();
            dataSource.put(book, queryExisting);
            dataSource.delete(queryNotExisting);

            return expect(dataSource.get(queryExisting)).resolves.toEqual(book);
        });

        it('On existing key delete value', () => {
            expect.assertions(1);
            const query = getDefaultKeyQuery();
            const book = getDefaultBook();
            dataSource.put(book, query);
            dataSource.delete(query);

            return expect(dataSource.get(query)).resolves.toEqual(undefined);
        });
    });
});

function getDefaultKeyQuery(): KeyQuery {
    return new KeyQuery('bookOne');
}

function getNotExistingKeyQuery(): KeyQuery {
    return new KeyQuery('some key that not exist');
}

function getNotSupportedQuery(): Query {
    return new Query();
}
