import { Dictionary, ParameterType } from '../../data';

export class Query {}

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

export class VoidQuery extends Query {}

export class IdQuery<T extends number | string> extends KeyQuery {
    constructor(public readonly id: T) {
        super(id.toString());
    }
}

export class IdsQuery<T> extends Query {
    constructor(public readonly ids: T[]) {
        super();
    }
}

export class AllObjectsQuery extends Query {
    constructor() {
        super();
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

export class ObjectRelationsQuery<T> extends ObjectQuery<T> {
    constructor(value: T, public readonly relations: string[] = []) {
        super(value);
    }
}

export abstract class PaginationQuery extends Query {}

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

export class DictionaryQuery<T> extends Query {
    constructor(public dictionary: Record<string, T>) {
        super();
    }
}

export class DictionaryRelationsQuery<T> extends DictionaryQuery<T> {
    constructor(public dictionary: Record<string, T>, public relations: string[] = []) {
        super(dictionary);
    }
}

export abstract class NetworkQuery extends Query {
    abstract get endpoint(): string;

    get body(): string | FormData {
        return '';
    }
    get urlParameters(): Record<string, ParameterType> {
        return {};
    }
    get queryParameters(): Record<string, ParameterType> {
        return {};
    }
    get headers(): Record<string, string> {
        return {};
    }
}
