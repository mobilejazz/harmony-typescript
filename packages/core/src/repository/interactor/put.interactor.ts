import { DefaultOperation, PutRepository, Operation, Query, VoidQuery } from '../index';

export class PutInteractor<T> {
    constructor(private readonly repository: PutRepository<T>) {}

    public execute(value: T, query: Query = new VoidQuery(), operation: Operation = new DefaultOperation()): Promise<T> {
        return this.repository.put(value, query, operation);
    }
}
