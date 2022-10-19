import { DefaultOperation, GetRepository, Operation, Query, VoidQuery } from '../index';

/**
 * @deprecated please use GetInteractor with an array type instead
 */
export class GetAllInteractor<T> {
    constructor(private readonly repository: GetRepository<T>) {}

    public execute(query: Query = new VoidQuery(), operation: Operation = new DefaultOperation()): Promise<T[]> {
        console.warn('GetAllInteractor is deprecated. Please use GetInteractor instead');
        return this.repository.getAll(query, operation);
    }
}
