import { HttpParameters } from './parameter-type';
import { Observable } from 'rxjs';

export interface HttpRequestBuilder<T = unknown> {
    setBody(body: unknown): this;
    setQueryParameters(queryParameters: HttpParameters): this;
    setUrlParameters(urlParameters: HttpParameters): this;

    get(): Observable<T | undefined>;
    post(): Observable<T | undefined>;
    put(): Observable<T | undefined>;
    delete(): Observable<void>;
}
