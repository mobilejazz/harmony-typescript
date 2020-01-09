import {SQLWhereQuery} from '@mobilejazz/harmony-core';

export class OAuthTokenIdQuery extends SQLWhereQuery {
    constructor(
        private readonly tokenId: string|number,
    ) { super(); }
    whereParams(): any[] {
        return [this.tokenId];
    }
    whereSql(): string {
        return 'token_id = ?';
    }
}
