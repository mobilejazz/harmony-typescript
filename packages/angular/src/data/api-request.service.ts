import { HttpClient } from '@angular/common/http';
import { AngularHttpRequestBuilder, HttpRequestBuilder } from './http-request.builder';
import { AuthService } from './auth.service';

// TODO: Move to `harmony-core`
export abstract class ApiRequestService {
    constructor(private readonly baseUrl: string) {
        // Normalize slashes: remove end slashes & spaces
        this.baseUrl = this.baseUrl.replace(/\/+$/, '').trimEnd();
    }

    protected abstract create<T>(endpoint: string): HttpRequestBuilder<T>;

    public builder<T = unknown>(path: string): HttpRequestBuilder<T> {
        // Normalize slashes: remove start slashes & spaces
        path = path.replace(/^\/+/, '').trimStart();

        return this.create(`${this.baseUrl}/${path}`);
    }
}

export class AngularApiRequestService extends ApiRequestService {
    constructor(baseUrl: string, private readonly http: HttpClient, private readonly authService: AuthService) {
        super(baseUrl);
    }

    protected create<T>(endpoint: string): HttpRequestBuilder<T> {
        return new AngularHttpRequestBuilder<T>(endpoint, this.http, this.authService);
    }
}
