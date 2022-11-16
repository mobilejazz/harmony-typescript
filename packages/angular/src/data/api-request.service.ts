import { HttpClient } from '@angular/common/http';
import { HttpRequestBuilder } from './http-request.builder';
import { AuthService } from './auth.service';

export class ApiRequestService {
    constructor(
        private readonly baseUrl: string,
        private readonly http: HttpClient,
        private readonly authService: AuthService,
    ) {}

    public builder<T = unknown>(endpoint: string): HttpRequestBuilder<T> {
        return new HttpRequestBuilder<T>(this.baseUrl + endpoint, this.http, this.authService);
    }
}
