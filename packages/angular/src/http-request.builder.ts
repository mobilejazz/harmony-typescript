import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { JsonDeserializerMapper, ParameterType, Type, UrlBuilder } from '@mobilejazz/harmony-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Request builder
export class HttpRequestBuilder<T> {
    private urlBuilder: UrlBuilder;

    private body: string | FormData = '';
    private headers: HttpHeaders = new HttpHeaders();
    private responseConstructor!: Type<T>;

    constructor(endpoint: string, private http: HttpClient) {
        this.urlBuilder = new UrlBuilder(endpoint);
        this.setDefaultHeaders();
    }

    public setUrlParameters(urlParameters: Record<string, ParameterType>): HttpRequestBuilder<T> {
        this.urlBuilder.setUrlParameters(urlParameters);
        return this;
    }

    public setQueryParameters(queryParameters: Record<string, ParameterType>): HttpRequestBuilder<T> {
        this.urlBuilder.setQueryParameters(queryParameters);
        return this;
    }

    public setBody(body: unknown): HttpRequestBuilder<T> {
        this.body = JSON.stringify(body);
        return this;
    }

    public setFormData(form: FormData): HttpRequestBuilder<T> {
        // Remove `Content-Type`, let `HttpClient` generate the proper `multipart/form-data` header with the boundary delimiter
        this.headers = this.headers.delete('Content-Type');
        this.body = form;
        return this;
    }

    public setHeaders(headers: Record<string, string>): HttpRequestBuilder<T> {
        Object.keys(headers).forEach((key: string): void => {
            this.headers = this.headers.append(key, headers[key]);
        });
        return this;
    }

    public setResponseConstructor(responseConstructor: Type<T>): HttpRequestBuilder<T> {
        this.responseConstructor = responseConstructor;
        return this;
    }

    private setDefaultHeaders(): void {
        this.setHeaders({
            'Content-Type': 'application/json',
            Accept: 'application/json',
        });
    }

    private mapItem(responseItem: string | Record<string, unknown>): T {
        const mapper = new JsonDeserializerMapper(this.responseConstructor);
        return mapper.map(responseItem);
    }

    // HACK: This is problematic but it's the best we can do right now.
    // Let's assume that `T` equals to the return type of this `mapResponse`.
    // See: https://app.asana.com/0/1109863238977521/1203450043003508/f
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private mapResponse(res: HttpResponse<T>): any {
        if (!res.body) {
            return undefined;
        }

        if (!this.responseConstructor) {
            return res.body;
        }

        if (Array.isArray(res.body)) {
            return res.body.map((item) => {
                return this.mapItem(item);
            });
        }

        return this.mapItem(res.body);
    }

    public get(): Observable<T> {
        return this.http
            .get<T>(this.urlBuilder.getUrl(), { observe: 'response', headers: this.headers })
            .pipe(map((res) => this.mapResponse(res)));
    }

    public post(): Observable<T> {
        return this.http
            .post<T>(this.urlBuilder.getUrl(), this.body, { observe: 'response', headers: this.headers })
            .pipe(map((res) => this.mapResponse(res)));
    }

    public put(): Observable<T> {
        return this.http
            .put<T>(this.urlBuilder.getUrl(), this.body, { observe: 'response', headers: this.headers })
            .pipe(map((res) => this.mapResponse(res)));
    }

    public delete(): Observable<void> {
        return this.http.delete<T>(this.urlBuilder.getUrl(), { observe: 'response', headers: this.headers }).pipe(
            map(() => {
                return;
            }),
        );
    }
}
