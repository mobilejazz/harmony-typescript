import {AllObjectsQuery, IdQuery, IdsQuery, InMemoryDataSource, InvalidArgumentError, KeyQuery, NotFoundError, PaginationPageQuery, QueryNotSupportedError, VoidQuery} from '../../../src';

class SimplestClass {
    constructor(public readonly id: number) {
    }
}

class SimplestQuery extends KeyQuery {
    constructor(value: SimplestClass) {
        super(value.id.toString());
    }
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

    describe('getAll', () => {
        it(`should handle 'IdsQuery'`, async () => {
            const dataSource = new InMemoryDataSource<SimplestClass>();
            await dataSource.put(myObject1, new SimplestQuery(myObject1));
            await dataSource.put(myObject2, new SimplestQuery(myObject2));

            const result = await dataSource.getAll(new IdsQuery([
                myObject1.id,
                myObject2.id,
            ]));

            expect(result.length).toBe(2);
            expect(result[0]).toBe(myObject1);
            expect(result[1]).toBe(myObject2);
        });

        it(`should error if 'IdsQuery' is not found`, () => {
            const dataSource = new InMemoryDataSource<SimplestClass>(); // EMPTY

            const result = dataSource.getAll(new IdsQuery([
                myObject1.id,
                myObject2.id,
            ]));

            expect(result).rejects.toThrow(NotFoundError);
        });

        it(`should handle 'KeyQuery'`, async () => {
            const dataSource = new InMemoryDataSource<SimplestClass>();
            await dataSource.putAll([myObject1, myObject2], keyQuery);

            const result = await dataSource.getAll(keyQuery);

            expect(result.length).toBe(2);
            expect(result[0]).toBe(myObject1);
            expect(result[1]).toBe(myObject2);
        });

        it(`should error if 'KeyQuery' is not found`, () => {
            const dataSource = new InMemoryDataSource<SimplestClass>(); // EMPTY

            const result = dataSource.getAll(keyQuery);

            expect(result).rejects.toThrow(NotFoundError);
        });

        it(`should handle 'AllObjectsQuery'`, async () => {
            const dataSource = new InMemoryDataSource<SimplestClass>();
            await dataSource.put(myObject1, keyQuery);
            await dataSource.putAll([myObject1, myObject2], keyQuery);

            const result = await dataSource.getAll(new AllObjectsQuery());

            expect(result.length).toBe(3);
            expect(result[0]).toBe(myObject1);
            expect(result[1]).toBe(myObject1);
            expect(result[2]).toBe(myObject2);
        });

        it(`should error when the Query is not supported`, async () => {
            const dataSource = new InMemoryDataSource<SimplestClass>();

            const result = dataSource.getAll(new VoidQuery());

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

    describe('putAll', () => {
        it(`should throw an error if 'values' is 'undefined'`, () => {
            const dataSource = new InMemoryDataSource<SimplestClass>();

            const result = dataSource.putAll(undefined, keyQuery);

            expect(result).rejects.toThrow(InvalidArgumentError);
        });

        it(`should throw an error if there is a values and 'IdsQuery' length mismatch`, () => {
            const dataSource = new InMemoryDataSource<SimplestClass>();

            const result = dataSource.putAll([], new IdsQuery([10]));

            expect(result).rejects.toThrow(InvalidArgumentError);
        });

        it(`should handle 'IdsQuery'`, async () => {
            const dataSource = new InMemoryDataSource<SimplestClass>();
            const query = new IdsQuery([myObject1.id]);

            await dataSource.putAll([myObject1], query);

            const result = await dataSource.getAll(query);
            expect(result.length).toBe(1);
            expect(result[0]).toBe(myObject1);
        });

        it(`should handle 'KeyQuery'`, async () => {
            const dataSource = new InMemoryDataSource<SimplestClass>();

            await dataSource.putAll([myObject1], keyQuery);

            const result = await dataSource.getAll(keyQuery);
            expect(result.length).toBe(1);
            expect(result[0]).toBe(myObject1);
        });

        it(`should error when the Query is not supported`, () => {
            const dataSource = new InMemoryDataSource<SimplestClass>();

            const result = dataSource.putAll([], new VoidQuery());

            expect(result).rejects.toThrow(QueryNotSupportedError);
        });
    });

    describe('delete', () => {
        it(`should handle 'IdsQuery'`, async () => {
            const dataSource = new InMemoryDataSource<SimplestClass>();
            await dataSource.put(myObject1, new IdQuery(myObject1.id));
            await dataSource.putAll([myObject1], keyQuery);

            await dataSource.delete(new IdsQuery([myObject1.id]));
            await dataSource.delete(new IdsQuery([keyQuery.key]));

            await expect(dataSource.get(new IdQuery(myObject1.id))).rejects.toThrow(NotFoundError);
            await expect(dataSource.getAll(keyQuery)).rejects.toThrow(NotFoundError);
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
