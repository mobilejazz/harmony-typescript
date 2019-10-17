import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Dictionary, JsonDeserializerMapper, ParameterType, UrlBuilder } from '@mobilejazz/harmony-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class HttpRequestBuilder<T> {
    private urlBuilder: UrlBuilder;

    private body = '';
    private headers: HttpHeaders = new HttpHeaders();
    private responseConstructor: any;

    constructor(
        endpoint: string,
        private http: HttpClient,
    ) {
        this.urlBuilder = new UrlBuilder(endpoint);
        this.setDefaultHeaders();
    }

    public setUrlParameters(urlParameters: Dictionary<ParameterType>): HttpRequestBuilder<T> {
        this.urlBuilder.setUrlParameters(urlParameters);
        return this;
    }

    public setQueryParameters(queryParameters: Dictionary<ParameterType>): HttpRequestBuilder<T> {
        this.urlBuilder.setQueryParameters(queryParameters);
        return this;
    }

    public setBody(body: object): HttpRequestBuilder<T> {
        this.body = JSON.stringify(body);
        return this;
    }

    public setHeaders(headers: Dictionary<string>): HttpRequestBuilder<T> {
        Object.keys(headers).forEach((key: string): void => {
            this.headers = this.headers.append(key, headers[key]);
        });
        return this;
    }

    public setResponseConstructor(responseConstructor: any) {
        this.responseConstructor = responseConstructor;
        return this;
    }

    private setDefaultHeaders() {
        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
        this.setHeaders(defaultHeaders);
    }

    private mapResponse(responseItem: object): any {
        const mapper = new JsonDeserializerMapper<object, any>(this.responseConstructor);
        return mapper.map(responseItem);
    }

    public get(): Observable<T> {
        return this.http
            .get<T>(this.urlBuilder.getUrl(), { observe: 'response', headers: this.headers })
            .pipe(map((response: any) => {
                if (!response.body) {
                    return null;
                }
                if ( !this.responseConstructor ) {
                    return response.body;
                }
                if (response.body instanceof Array) {
                    return response.body.map((responseItem: object) => {
                        return this.mapResponse(responseItem);
                    });
                }
                return this.mapResponse(response.body);
            } ));
    }

    public post(): Observable<T> {
        return this.http
            .post<T>(this.urlBuilder.getUrl(), this.body, { observe: 'response', headers: this.headers })
            .pipe(map((response: any) => {
                if (!response.body) {
                    return null;
                }
                if ( !this.responseConstructor ) {
                    return response.body;
                }
                if (response.body instanceof Array) {
                    return response.body.map((responseItem: object) => {
                        return this.mapResponse(responseItem);
                    });
                }
                return this.mapResponse(response.body);
            } ));
    }

    public put(): Observable<T> {
        return this.http
            .put<T>(this.urlBuilder.getUrl(), this.body, { observe: 'response', headers: this.headers })
            .pipe(map((response: any) => {
                if (!response.body) {
                    return null;
                }
                if ( !this.responseConstructor ) {
                    return response.body;
                }
                if (response.body instanceof Array) {
                    return response.body.map((responseItem: object) => {
                        return this.mapResponse(responseItem);
                    });
                }
                return this.mapResponse(response.body);
            } ));
    }

    public delete(): Observable<void> {
        return this.http
            .delete<T>(this.urlBuilder.getUrl(), { observe: 'response', headers: this.headers })
            .pipe(map((response: any) => {
                return;
            } ));
    }

}
