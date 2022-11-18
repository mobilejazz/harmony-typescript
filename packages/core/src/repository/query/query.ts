export class Query {
}

export class KeyQuery extends Query {
    constructor(public readonly key: string) {
        super();
    }
}

export class KeyListQuery extends KeyQuery {
    constructor(public readonly keys: string[]) {
        super(keys.join(','));
    }
}

export class VoidQuery extends Query {
}

export class IdQuery<T extends number | string> extends KeyQuery {
    constructor(public readonly id: T) {
        super(id.toString());
    }
}

export class IdsQuery<T extends number | string> extends KeyListQuery {
    constructor(public readonly ids: T[]) {
        super(ids.map(id => id.toString()));
    }
}

export class AllObjectsQuery extends Query {
    constructor() {
        super();
    }
}

export abstract class PaginationQuery extends Query {
}

export class PaginationOffsetLimitQuery extends PaginationQuery {
    constructor(public readonly offset: number, public readonly limit: number) {
        super();
    }
}

export class PaginationPageQuery extends PaginationQuery {
    constructor(public readonly page: number) {
        super();
    }
}
