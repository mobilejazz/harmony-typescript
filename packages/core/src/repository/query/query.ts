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

/**
 * @deprecated
 */
export class ObjectQuery<T> extends Query {
    constructor(public readonly value: T) {
        super();
    }
}

/**
 * @deprecated
 */
export class ObjectsQuery<T> extends Query {
    constructor(public readonly values: T[]) {
        super();
    }
}

/**
 * @deprecated
 */
export class ObjectRelationsQuery<T> extends ObjectQuery<T> {
    constructor(value: T, public readonly relations: string[] = []) {
        super(value);
    }
}

/**
 * @deprecated
 */
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

/**
 * @deprecated
 */
export class DictionaryQuery<T> extends Query {
    constructor(public dictionary: Record<string, T>) {
        super();
    }
}

/**
 * @deprecated
 */
export class DictionaryRelationsQuery<T> extends DictionaryQuery<T> {
    constructor(public dictionary: Record<string, T>, public relations: string[] = []) {
        super(dictionary);
    }
}
