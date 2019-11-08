import { DefaultOperation, GetRepository, Operation, Query, VoidQuery } from '../index';

export class GetAllInteractor<T> {
    constructor(private readonly repository: GetRepository<T>) {}

    public execute(query: Query = new VoidQuery(), operation: Operation = new DefaultOperation()): Promise<T[]> {
        return this.repository.getAll(query, operation);
    }
}
