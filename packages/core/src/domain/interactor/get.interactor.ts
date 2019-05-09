import { DefaultOperation, GetRepository, Operation, Query, VoidQuery } from '../../repository';

export class GetInteractor<T> {
    constructor(private readonly repository: GetRepository<T>) {}

    async execute(query?: Query, operation?: Operation): Promise<T>;
    async execute<K>(id?: K, operation?: Operation): Promise<T>;
    async execute<K>(queryOrId: Query | K = new VoidQuery(), operation: Operation = new DefaultOperation()): Promise<T> {
        return await this.repository.get(queryOrId, operation);
    }
}
