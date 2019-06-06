import { DefaultOperation, DeleteRepository, Operation, Query, VoidQuery } from '../../repository';

export class DeleteAllInteractor {

    constructor(private readonly repository: DeleteRepository) {}

    async execute(query: Query, operation: Operation): Promise<void>;
    async execute<K>(ids: K[], operation: Operation): Promise<void>;
    async execute<K>(queryOrIds: Query | K[] = new VoidQuery(), operation: Operation = new DefaultOperation()): Promise<void> {
        return await this.repository.deleteAll(queryOrIds, operation);
    }
}
