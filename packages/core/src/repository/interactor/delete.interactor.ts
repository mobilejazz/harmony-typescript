import { DefaultOperation, DeleteRepository, Operation, Query, VoidQuery } from '../index';

export class DeleteInteractor {

    constructor(private readonly repository: DeleteRepository) {}

    public execute(query: Query, operation: Operation = new DefaultOperation()): Promise<void> {
        return this.repository.delete(query, operation);
    }
}
