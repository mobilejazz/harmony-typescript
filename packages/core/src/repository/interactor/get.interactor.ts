import { DefaultOperation, GetRepository, Operation, Query, VoidQuery } from '../index';

export class GetInteractor<T> {
    constructor(private readonly repository: GetRepository<T>) {}

    public execute(query: Query, operation: Operation = new DefaultOperation()): Promise<T> {
        return this.repository.get(query, operation);
    }
}
