import { Dictionary } from '../../shared';

export class Query  {

}

export class KeyQuery extends Query {
    constructor(public readonly key: string) {
        super();
    }
}

export class VoidQuery extends Query {}

export class IdQuery<T> extends KeyQuery {
    constructor(public readonly id: T) {
        super(id.toString());
    }
}

export class IdsQuery<T> extends KeyQuery {
    constructor(public readonly ids: T[]) {
        super(ids.toString());
    }
}

export class AllObjectsQuery extends KeyQuery {
    constructor() {
        super('allObjects');
    }
}

export class ObjectQuery<T> extends Query {
    constructor(public readonly value: T) {
        super();
    }
}

export class ObjectsQuery<T> extends Query {
    constructor(public readonly values: T[]) {
        super();
    }
}

export abstract class PaginationQuery extends Query { }

export class PaginationOffsetLimitQuery extends PaginationQuery {
    constructor(
        public readonly offset: number,
        public readonly limit: number,
    ) {
        super();
    }
}

export class DictionaryQuery extends Query {
    constructor(public dictionary: Dictionary) {
        super();
    }
}

export class DictionaryRelationsQuery extends DictionaryQuery {
    constructor(public dictionary: Dictionary, public relations: string[] = []) {
        super(dictionary);
    }
}
