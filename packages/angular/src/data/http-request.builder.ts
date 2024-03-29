import { HttpClient } from '@angular/common/http';
import { UrlBuilder, HttpRequestBuilder, HttpParameters } from '@mobilejazz/harmony-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

interface RequestOptions {
    headers: Record<string, string | string[]>;
    observe: 'response';
    responseType: 'json';
}

export class AngularHttpRequestBuilder<T = unknown> implements HttpRequestBuilder<T> {
    private urlBuilder: UrlBuilder;
    private body: string | FormData | null = null;

    constructor(
        protected readonly endpoint: string,
        protected readonly http: HttpClient,
        protected readonly authService: AuthService,
    ) {
        this.urlBuilder = new UrlBuilder(endpoint);
    }

    private createRequestOptions(): RequestOptions {
        const headers = {
            ...this.defaultHeaders,
            ...this.authService.getAuthHeaders(),
        };

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

    public setUrlParameters(urlParameters: HttpParameters): this {
        this.urlBuilder.setUrlParameters(urlParameters);
        return this;
    }

    public setQueryParameters(queryParameters: HttpParameters): this {
        this.urlBuilder.setQueryParameters(queryParameters);
        return this;
    }

    public setBody(body: unknown): this {
        this.body = JSON.stringify(body);
        return this;
    }

    public get(): Observable<T | undefined> {
        return this.http
            .get<T>(this.urlBuilder.getUrl(), this.createRequestOptions())
            .pipe(map((res) => res.body ?? undefined));
    }

    public post(): Observable<T | undefined> {
        return this.http
            .post<T>(this.urlBuilder.getUrl(), this.body, this.createRequestOptions())
            .pipe(map((res) => res.body ?? undefined));
    }

    public put(): Observable<T | undefined> {
        return this.http
            .put<T>(this.urlBuilder.getUrl(), this.body, this.createRequestOptions())
            .pipe(map((res) => res.body ?? undefined));
    }

    public delete(): Observable<void> {
        return this.http.delete<T>(this.urlBuilder.getUrl(), this.createRequestOptions()).pipe(
            map(() => {
                return;
            }),
        );
    }
}
