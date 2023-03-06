import { HttpRequestBuilder } from '../../data';

export abstract class ApiRequestService {
    protected constructor(private readonly baseUrl: string) {
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
