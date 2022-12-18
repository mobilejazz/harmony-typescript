import { ParameterType } from './parameter-type';
import { Observable } from 'rxjs';

export interface HttpRequestBuilder<T = unknown> {
    setBody(body: unknown): this;
    setQueryParameters(queryParameters: Record<string, ParameterType>): this;
    setUrlParameters(urlParameters: Record<string, ParameterType>): this;

    get(): Observable<T | undefined>;
    post(): Observable<T | undefined>;
    put(): Observable<T | undefined>;
    delete(): Observable<void>;
}
