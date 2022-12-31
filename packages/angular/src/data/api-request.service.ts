import { HttpClient } from '@angular/common/http';
import { ApiRequestService, HttpRequestBuilder } from '@mobilejazz/harmony-core';
import { AngularHttpRequestBuilder } from './http-request.builder';
import { AuthService } from './auth.service';

export class AngularApiRequestService extends ApiRequestService {
    constructor(baseUrl: string, private readonly http: HttpClient, private readonly authService: AuthService) {
        super(baseUrl);
    }

    protected create<T>(endpoint: string): HttpRequestBuilder<T> {
        return new AngularHttpRequestBuilder<T>(endpoint, this.http, this.authService);
    }
}
