import { HttpParameter } from './parameter-type';
import { Observable } from 'rxjs';

export interface HttpRequestBuilder<T = unknown> {
    setBody(body: unknown): this;
    setQueryParameters(queryParameters: HttpParameter): this;
    setUrlParameters(urlParameters: HttpParameter): this;

    get(): Observable<T | undefined>;
    post(): Observable<T | undefined>;
    put(): Observable<T | undefined>;
    delete(): Observable<void>;
}
