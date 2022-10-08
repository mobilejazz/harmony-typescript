import { EntityManager } from 'typeorm';
import { SQLInterface } from '@mobilejazz/harmony-core';

export class TypeORMSQLInterface implements SQLInterface {
    constructor(private readonly entityManager: EntityManager) {}

    public query<T = unknown>(query: string, parameters?: unknown[]): Promise<T> {
        return this.entityManager.query(query, parameters);
    }

    public transaction<T>(runInTransaction: (sqlInterface: SQLInterface) => Promise<T>): Promise<T> {
        return this.entityManager.transaction((entityManager: EntityManager) => {
            return runInTransaction(new TypeORMSQLInterface(entityManager));
        });
    }
}
