import { DefaultOperation, DeleteRepository, Operation, Query, VoidQuery } from '../index';
import { Logger, DeviceConsoleLogger } from 'helpers';

export class DeleteAllInteractor {
    constructor(
        private readonly repository: DeleteRepository,
        private readonly logger: Logger = new DeviceConsoleLogger(),
    ) {}

    public execute(query: Query = new VoidQuery(), operation: Operation = new DefaultOperation()): Promise<void> {
        this.logger.warning('[DEPRECATION] `deleteAll` will be deprecated. Use `DeleteInteractor` instead.');
        return this.repository.deleteAll(query, operation);
    }
}
