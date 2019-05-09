import { DefaultOperation, PutRepository, Operation, Query, VoidQuery } from '../../repository';

export class PutAllInteractor<T> {
    constructor(private readonly repository: PutRepository<T>) {}

    async execute(values: T[], query: Query, operation: Operation): Promise<T[]>;
    async execute<K>(values: T[], ids: K[], operation: Operation): Promise<T[]>;
    async execute<K>(values: T[], queryOrIds: Query | K[] = new VoidQuery(), operation: Operation = new DefaultOperation()): Promise<T[]> {
        return await this.repository.putAll(values, queryOrIds, operation);
    }
}
