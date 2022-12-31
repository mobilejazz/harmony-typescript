import { ParameterType } from '../../data';

export abstract class NetworkQuery {
    constructor(public readonly endpoint: string) {}

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

export class GetNetworkQuery extends NetworkQuery {}
export class PostNetworkQuery extends NetworkQuery {}
export class PutNetworkQuery extends NetworkQuery {}
export class DeleteNetworkQuery extends NetworkQuery {}
