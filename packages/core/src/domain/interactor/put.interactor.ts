import { DefaultOperation, PutRepository, Operation, Query, VoidQuery } from '../../repository';

export class PutInteractor<T> {
    constructor(private readonly repository: PutRepository<T>) {}

    async execute(value: T, query?: Query, operation?: Operation): Promise<T>;
    async execute<K>(value: T, id?: K, operation?: Operation): Promise<T>;
    async execute<K>(value: T, queryOrId: Query | K = new VoidQuery(), operation: Operation = new DefaultOperation()): Promise<T> {
        return await this.repository.put(value, queryOrId, operation);
    }
}
