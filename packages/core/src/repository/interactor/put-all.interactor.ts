import { DefaultOperation, PutRepository, Operation, Query, VoidQuery } from '../index';

export class PutAllInteractor<T> {
    constructor(private readonly repository: PutRepository<T>) {}

    public execute(
        values: T[] | undefined,
        query: Query = new VoidQuery(),
        operation: Operation = new DefaultOperation(),
    ): Promise<T[]> {
        return this.repository.putAll(values, query, operation);
    }
}
