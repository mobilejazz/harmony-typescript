import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BlankMapper, Mapper, ParameterType, UrlBuilder } from '@mobilejazz/harmony-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

interface RequestOptions {
    headers: HttpHeaders;
    observe: 'response';
    responseType: 'json';
}

export class HttpRequestBuilder<T = unknown> {
    private urlBuilder: UrlBuilder;
    private body: string | FormData = '';

    // This `as ...` is needed to appease TS. Feel free to try to remove it.
    private mapper: Mapper<unknown, T> = new BlankMapper() as Mapper<unknown, T>;

    constructor(
        protected readonly endpoint: string,
        protected readonly http: HttpClient,
        protected readonly authService: AuthService,
    ) {
        this.urlBuilder = new UrlBuilder(endpoint);
    }

    // HEADERS & OPTIONS

    private createRequestOptions(): RequestOptions {
        const headers = new HttpHeaders({
            ...this.defaultHeaders,
            ...this.authService.getAuthHeaders(),
        });

        return {
            observe: 'response',
            responseType: 'json',
            headers,
        };
    }

    private get defaultHeaders(): Record<string, string> {
        return {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        };
    }

    public setMapper<From>(mapper: Mapper<From, T>): this {
        this.mapper = mapper;
        return this;
    }

    private mapResponse(res: HttpResponse<T>): T | undefined {
        if (!res.body) {
            return undefined;
        }

        return this.mapper.map(res.body);
    }

    public setUrlParameters(urlParameters: Record<string, ParameterType>): this {
        this.urlBuilder.setUrlParameters(urlParameters);
        return this;
    }

    public setQueryParameters(queryParameters: Record<string, ParameterType>): this {
        this.urlBuilder.setQueryParameters(queryParameters);
        return this;
    }

    public setBody(body: unknown): this {
        this.body = JSON.stringify(body);
        return this;
    }

    // METHODS

    public get(): Observable<T | undefined> {
        return this.http
            .get<T>(this.urlBuilder.getUrl(), this.createRequestOptions())
            .pipe(map((res) => this.mapResponse(res)));
    }

    public post(): Observable<T | undefined> {
        return this.http
            .post<T>(this.urlBuilder.getUrl(), this.body, this.createRequestOptions())
            .pipe(map((res) => this.mapResponse(res)));
    }

    public put(): Observable<T | undefined> {
        return this.http
            .put<T>(this.urlBuilder.getUrl(), this.body, this.createRequestOptions())
            .pipe(map((res) => this.mapResponse(res)));
    }

    public delete(): Observable<void> {
        return this.http.delete<T>(this.urlBuilder.getUrl(), this.createRequestOptions()).pipe(
            map(() => {
                return;
            }),
        );
    }
}
