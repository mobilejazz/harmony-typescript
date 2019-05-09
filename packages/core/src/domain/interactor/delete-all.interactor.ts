import { DefaultOperation, DeleteRepository, Operation, Query, VoidQuery } from '../../repository';

export class DeleteAllInteractor {

    constructor(private readonly repository: DeleteRepository) {}

    async execute(query: Query, operation: Operation): Promise<boolean>;
    async execute<K>(ids: K[], operation: Operation): Promise<boolean>;
    async execute<K>(queryOrIds: Query | K[] = new VoidQuery(), operation: Operation = new DefaultOperation()): Promise<boolean> {
        return await this.repository.deleteAll(queryOrIds, operation);
    }
}
