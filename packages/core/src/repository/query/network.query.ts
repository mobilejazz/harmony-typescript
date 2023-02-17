import { ParameterType } from '../../data';
import {KeyQuery} from "./query";

export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

export abstract class NetworkQuery extends KeyQuery {
    constructor(key = '') {
        super(key);
    }

    abstract get method(): HttpMethod;

    get path(): string {
        return '/';
    }

    get body(): unknown | undefined {
        return undefined;
    }

    get urlParameters(): Record<string, ParameterType> {
        return {};
    }

    get queryParameters(): Record<string, ParameterType> {
        return {};
    }
}

export abstract class NetworkOneQuery extends NetworkQuery {
    constructor(private readonly pathOne: string, private readonly id: string | number) {
        super();
    }

    abstract get method(): HttpMethod;

    public get path(): string {
        return this.pathOne;
    }

    public get urlParameters(): Record<string, ParameterType> {
        return {
            id: this.id,
        };
    }
}

export class GetOneNetworkQuery extends NetworkOneQuery {
    public get method(): HttpMethod {
        return HttpMethod.GET;
    }
}

export class PutOneNetworkQuery extends NetworkOneQuery {
    public get method(): HttpMethod {
        return HttpMethod.PUT;
    }
}

export class DeleteOneNetworkQuery extends NetworkOneQuery {
    public get method(): HttpMethod {
        return HttpMethod.DELETE;
    }
}

export class GetNetworkQuery extends NetworkQuery {
    public get method(): HttpMethod {
        return HttpMethod.GET;
    }
}

export class PostNetworkQuery extends NetworkQuery {
    public get method(): HttpMethod {
        return HttpMethod.POST;
    }
}

export class PutNetworkQuery extends NetworkQuery {
    public get method(): HttpMethod {
        return HttpMethod.PUT;
    }
}

export class DeleteNetworkQuery extends NetworkQuery {
    public get method(): HttpMethod {
        return HttpMethod.DELETE;
    }
}