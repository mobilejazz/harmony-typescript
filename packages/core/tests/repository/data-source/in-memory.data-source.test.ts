import {
    AllObjectsQuery,
    IdQuery,
    IdsQuery,
    InMemoryDataSource,
    InvalidArgumentError,
    KeyQuery,
    NotFoundError,
    QueryNotSupportedError,
    VoidQuery,
} from '../../../src';

class SimplestClass {
    constructor(public readonly id: number) {}
}

describe('InMemoryDataSource', () => {
    const myObject1 = new SimplestClass(1);
    const myObject2 = new SimplestClass(2);
    const keyQuery = new KeyQuery(`key-query`);
    const anotherKeyQuery = new KeyQuery(`Another value`);

    describe('get', () => {
        it(`should handle 'KeyQuery'`, async () => {
            const dataSource = new InMemoryDataSource<SimplestClass>();
            await dataSource.put(myObject1, keyQuery);

            const result = await dataSource.get(keyQuery);

            expect(result).toBe(myObject1);
        });

        it(`should throw an error when the 'KeyQuery' is not found`, async () => {
            const dataSource = new InMemoryDataSource<SimplestClass>();

            const result = dataSource.get(keyQuery);

            await expect(result).rejects.toThrowError(NotFoundError);
        });

        it('should error when the Query is not supported', () => {
            const dataSource = new InMemoryDataSource<SimplestClass>();

            const result = dataSource.get(new VoidQuery());

            expect(result).rejects.toThrow(QueryNotSupportedError);
        });
    });

    describe('put', () => {
        it(`should handle 'KeyQuery'`, async () => {
            const dataSource = new InMemoryDataSource<SimplestClass>();

            await dataSource.put(myObject1, keyQuery);

            const result = await dataSource.get(keyQuery);
            expect(result).toBe(myObject1);
        });

        it(`should throw an error if 'value' is 'undefined'`, () => {
            const dataSource = new InMemoryDataSource<SimplestClass>();

            const result = dataSource.put(undefined, keyQuery);

            expect(result).rejects.toThrow(InvalidArgumentError);
        });

        it('should error when the Query is not supported', () => {
            const dataSource = new InMemoryDataSource<SimplestClass>();

            const result = dataSource.put(myObject1, new VoidQuery());

            expect(result).rejects.toThrow(QueryNotSupportedError);
        });
    });

    describe('delete', () => {
        it(`should handle 'IdsQuery'`, async () => {
            const dataSource = new InMemoryDataSource<SimplestClass>();
            await dataSource.put(myObject1, new IdQuery(myObject1.id));

            await dataSource.delete(new IdsQuery([myObject1.id]));
            await dataSource.delete(new IdsQuery([keyQuery.key]));

            await expect(dataSource.get(new IdQuery(myObject1.id))).rejects.toThrow(NotFoundError);
        });

        it(`should delete the value associated to the given 'KeyQuery'`, async () => {
            const dataSource = new InMemoryDataSource<SimplestClass>();
            await dataSource.put(myObject1, keyQuery);

            await dataSource.delete(keyQuery);

            const result = dataSource.get(keyQuery);
            await expect(result).rejects.toThrow(NotFoundError);
        });

        it(`should do nothing when the 'KeyQuery' doesn't exists`, async () => {
            const dataSource = new InMemoryDataSource<SimplestClass>();
            await dataSource.put(myObject1, keyQuery);

            const result = dataSource.delete(anotherKeyQuery);

            await expect(result).toBeTruthy();
        });

        it(`should empty the data-source if 'AllObjectQuery' is given`, async () => {
            const dataSource = new InMemoryDataSource<SimplestClass>();
            await dataSource.put(myObject1, keyQuery);

            await dataSource.delete(new AllObjectsQuery());

            const result = dataSource.get(keyQuery);
            await expect(result).rejects.toThrow(NotFoundError);
        });

        it('should error when the Query is not supported', async () => {
            const dataSource = new InMemoryDataSource<SimplestClass>();
            await dataSource.put(myObject1, keyQuery);

            const result = dataSource.delete(new VoidQuery());

            await expect(result).rejects.toThrow(QueryNotSupportedError);
        });
    });
});
