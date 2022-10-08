import { Query } from '@mobilejazz/harmony-core';

export class CreateUserInfoQuery extends Query {
    constructor(public readonly tokenId: number, public readonly userId: string) {
        super();
    }
}
