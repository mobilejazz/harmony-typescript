import {SQLWhereQuery} from '@mobilejazz/harmony-core';

export class OAuthClientIdQuery extends SQLWhereQuery {
    constructor(
        private readonly clientId: string|number,
    ) { super(); }
    whereParams(): any[] {
        return [this.clientId];
    }
    whereSql(): string {
        return 'client_id = ?';
    }
}
