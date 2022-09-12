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
        it('get with a non-existing key should throw an error', async () => {
            const cacheDataSource = new InMemoryDataSource<SimplestClass>();
            await expect(cacheDataSource.get(keyQuery)).rejects.toThrowError(NotFoundError);
        });

        it('get with key query should return the key', async () => {
            const cacheDataSource = new InMemoryDataSource<SimplestClass>();
            await cacheDataSource.put(myObject, keyQuery);
            const response = await cacheDataSource.get(keyQuery);
            expect(response).toBe(myObject);
        });

        it('get with different query should throw an error', () => {
            const cacheDataSource = new InMemoryDataSource<SimplestClass>();
            expect(cacheDataSource.get(notAllowedQuery)).rejects.toThrow(QueryNotSupportedError);
        });
    });

    describe('put', () => {
        it('put should store the object', async () => {
            const cacheDataSource = new InMemoryDataSource<SimplestClass>();
            await cacheDataSource.put(myObject, keyQuery);
            const response = await cacheDataSource.get(keyQuery);
            expect(response).toBe(myObject);
        });

        it('put with different query should throw an error', () => {
            const cacheDataSource = new InMemoryDataSource<SimplestClass>();
            expect(cacheDataSource.put(myObject, notAllowedQuery)).rejects.toThrow(QueryNotSupportedError);
        });
    });

    describe('delete', () => {
        it('delete should empty the value of the stored object for a given key', async () => {
            const cacheDataSource = new InMemoryDataSource<SimplestClass>();
            await cacheDataSource.put(myObject, keyQuery);
            await cacheDataSource.delete(keyQuery);
            await expect(cacheDataSource.get(keyQuery)).rejects.toThrowError(NotFoundError);
        });

        it('delete with not existing key should work', async () => {
            const cacheDataSource = new InMemoryDataSource<SimplestClass>();
            await cacheDataSource.put(myObject, keyQuery);
            await expect(cacheDataSource.delete(anotherKeyQuery)).toBeTruthy();
        });

        it('delete with not admitted query should throw an error', async () => {
            const cacheDataSource = new InMemoryDataSource<SimplestClass>();
            await cacheDataSource.put(myObject, keyQuery);
            await expect(cacheDataSource.delete(notAllowedQuery)).rejects.toThrowError(QueryNotSupportedError);
        });
    });
});
