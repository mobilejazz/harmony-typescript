import { DefaultOperation, DeleteRepository, Operation, Query, VoidQuery } from '../index';

export class DeleteAllInteractor {

    constructor(private readonly repository: DeleteRepository) {}

    public execute(query: Query = new VoidQuery(), operation: Operation = new DefaultOperation()): Promise<void> {
        return this.repository.deleteAll(query, operation);
    }
}
