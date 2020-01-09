import {EntityManager} from "typeorm";
import {SQLInterface} from '@mobilejazz/harmony-core';

export class TypeORMSQLInterface implements SQLInterface {
    constructor(
        private readonly entityManager: EntityManager,
    ) { }

    query(query: string, parameters?: any[]): Promise<any> {
        return this.entityManager.query(query, parameters);
    }

    transaction<T>(runInTransaction: (sqlInterface: SQLInterface) => Promise<T>): Promise<T> {
        return this.entityManager.transaction((entityManager: EntityManager) => {
            return runInTransaction(new TypeORMSQLInterface(entityManager));
        });
    }
}
