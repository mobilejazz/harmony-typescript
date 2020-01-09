import {SQLWhereQuery} from '@mobilejazz/harmony-core';

export class OAuthClientQuery extends SQLWhereQuery {
    constructor(
        readonly clientId: string,
        readonly clientSecret: string,
    ) { super(); }
    whereParams(): any[] {
        return [this.clientId, this.clientSecret];
    }
    whereSql(): string {
        return 'client_id = ? and client_secret = ?';
    }
}
