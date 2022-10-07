import {InMemoryDataSource, KeyQuery, NotFoundError, ObjectQuery, QueryNotSupportedError} from '../../../src';

class SimplestClass {
    constructor(public readonly id: number) {}
}

describe('InMemoryDataSource', () => {
    const myObject = new SimplestClass(1);
    const keyQuery = new KeyQuery(`${myObject.id}`);
    const anotherKeyQuery = new KeyQuery(`Another value`);
    const notAllowedQuery = new ObjectQuery(myObject);

    describe('get', () => {
        it('should throw an error when a non-existing key is given', async () => {
            const cacheDataSource = new InMemoryDataSource<SimplestClass>();
            const result = cacheDataSource.get(keyQuery);
            await expect(result).rejects.toThrowError(NotFoundError);
        });

        it('should return the expected value for an existing key', async () => {
            const cacheDataSource = new InMemoryDataSource<SimplestClass>();
            await cacheDataSource.put(myObject, keyQuery);
            const result = await cacheDataSource.get(keyQuery);
            expect(result).toBe(myObject);
        });

        it('should throw an error with a different query than KeyQuery', () => {
            const cacheDataSource = new InMemoryDataSource<SimplestClass>();
            const result = cacheDataSource.get(notAllowedQuery);
            expect(result).rejects.toThrow(QueryNotSupportedError);
        });
    });

    describe('put', () => {
        it('should store an object when it`s given with a proper key', async () => {
            const cacheDataSource = new InMemoryDataSource<SimplestClass>();
            await cacheDataSource.put(myObject, keyQuery);
            const result = await cacheDataSource.get(keyQuery);
            expect(result).toBe(myObject);
        });

        it('should throw an error when the query is not a KeyQuery', () => {
            const cacheDataSource = new InMemoryDataSource<SimplestClass>();
            const result = cacheDataSource.put(myObject, notAllowedQuery);
            expect(result).rejects.toThrow(QueryNotSupportedError);
        });
    });

    describe('delete', () => {
        it('should empty the value of the stored object when an existing key is given', async () => {
            const cacheDataSource = new InMemoryDataSource<SimplestClass>();
            await cacheDataSource.put(myObject, keyQuery);
            await cacheDataSource.delete(keyQuery);
            const result = cacheDataSource.get(keyQuery)
            await expect(result).rejects.toThrow(NotFoundError);
        });

        it('should do nothing when the key does not exists', async () => {
            const cacheDataSource = new InMemoryDataSource<SimplestClass>();
            await cacheDataSource.put(myObject, keyQuery);
            const result = cacheDataSource.delete(anotherKeyQuery);
            await expect(result).toBeTruthy();
        });

        it('should throw an error when the query is not a KeyQuery', async () => {
            const cacheDataSource = new InMemoryDataSource<SimplestClass>();
            await cacheDataSource.put(myObject, keyQuery);
            const result = cacheDataSource.delete(notAllowedQuery);
            await expect(result).rejects.toThrow(QueryNotSupportedError);
        });
    });
});
