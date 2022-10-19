import { DefaultOperation, PutRepository, Operation, Query, VoidQuery } from '../index';

/**
 * @deprecated please use PutInteractor with an array type instead
 */
export class PutAllInteractor<T> {
    constructor(private readonly repository: PutRepository<T>) {}

    public execute(
        values: T[] | undefined,
        query: Query = new VoidQuery(),
        operation: Operation = new DefaultOperation(),
    ): Promise<T[]> {
        console.warn('PutAllInteractor is deprecated. Please use PutInteractor instead');
        return this.repository.putAll(values, query, operation);
    }
}
