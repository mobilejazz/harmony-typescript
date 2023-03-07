import { HttpBody, HttpParameters } from '../../data';
import { KeyQuery } from './query';

export enum HttpMethod {
    Get = 'GET',
    Post = 'POST',
    Put = 'PUT',
    Delete = 'DELETE',
}

export abstract class NetworkQuery extends KeyQuery {
    constructor(public readonly path: string, key: number | string = '') {
        super(key.toString());
    }

    abstract get method(): HttpMethod;

    get body(): HttpBody {
        return undefined;
    }

    get urlParameters(): HttpParameters {
        return {};
    }

    get queryParameters(): HttpParameters {
        return {};
    }
}

export abstract class NetworkOneQuery extends NetworkQuery {
    constructor(pathOne: string, private readonly id: string | number) {
        super(pathOne, id.toString());
    }

    abstract get method(): HttpMethod;

    public get urlParameters(): HttpParameters {
        return {
            id: this.id,
        };
    }
}

export class GetOneNetworkQuery extends NetworkOneQuery {
    public get method(): HttpMethod {
        return HttpMethod.Get;
    }
}

export class PutOneNetworkQuery extends NetworkOneQuery {
    public get method(): HttpMethod {
        return HttpMethod.Put;
    }
}

export class DeleteOneNetworkQuery extends NetworkOneQuery {
    public get method(): HttpMethod {
        return HttpMethod.Delete;
    }
}

export class GetNetworkQuery extends NetworkQuery {
    public get method(): HttpMethod {
        return HttpMethod.Get;
    }
}

export class PostNetworkQuery extends NetworkQuery {
    public get method(): HttpMethod {
        return HttpMethod.Post;
    }
}

export class PutNetworkQuery extends NetworkQuery {
    public get method(): HttpMethod {
        return HttpMethod.Put;
    }
}

export class DeleteNetworkQuery extends NetworkQuery {
    public get method(): HttpMethod {
        return HttpMethod.Delete;
    }
}
