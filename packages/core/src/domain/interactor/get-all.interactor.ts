import { DefaultOperation, GetRepository, Operation, Query, VoidQuery } from '../../repository';

export class GetAllInteractor<T> {
    constructor(private readonly repository: GetRepository<T>) {}

    async execute(query?: Query, operation?: Operation): Promise<T[]>;
    async execute<K>(ids?: K[], operation?: Operation): Promise<T[]>;
    async execute<K>(queryOrIds: Query | K[]  = new VoidQuery(), operation: Operation = new DefaultOperation()): Promise<T[]> {
        return await this.repository.getAll(queryOrIds, operation);
    }
}
