import { DefaultOperation, DeleteRepository, Operation, Query, VoidQuery } from '../../repository';

export class DeleteInteractor {

    constructor(private readonly repository: DeleteRepository) {}

    async execute(query: Query, operation?: Operation): Promise<boolean>;
    async execute<K>(id: K, operation?: Operation): Promise<boolean>;
    async execute<K>(queryOrId: Query | K = new VoidQuery(), operation: Operation = new DefaultOperation()): Promise<boolean> {
        return await this.repository.delete(queryOrId, operation);
    }
}
