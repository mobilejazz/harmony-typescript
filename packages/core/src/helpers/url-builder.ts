import { HttpParameters } from '../data';

export class UrlBuilder {
    constructor(private url: string) {}

    public getUrl(): string {
        return this.url;
    }

    public setUrlParameters(urlParameters: HttpParameters): UrlBuilder {
        this.url = this.prepareUrlParameters(this.url, urlParameters);
        return this;
    }

    public setQueryParameters(queryParameters: HttpParameters): UrlBuilder {
        this.url = this.prepareQueryParameters(this.url, queryParameters);
        return this;
    }

    private prepareUrlParameters(url: string, urlParameters: HttpParameters): string {
        for (const property in urlParameters) {
            if (Object.prototype.hasOwnProperty.call(urlParameters, property) && url.indexOf(`:${property}`) > -1) {
                url = url.replace(`:${property}`, urlParameters[property].toString());
            } else {
                throw new Error(`Parameter "${property}" does not exist in URL "${url}"`);
            }
        }
        return url;
    }

    private prepareQueryParameters(url: string, queryParameters: HttpParameters): string {
        let firstProperty = true;

        for (const property in queryParameters) {
            if (
                Object.prototype.hasOwnProperty.call(queryParameters, property) &&
                typeof queryParameters[property] !== 'undefined' &&
                queryParameters[property] !== null
            ) {
                url += firstProperty ? '?' : '&';
                firstProperty = false;
                url += `${property}=${encodeURIComponent(queryParameters[property].toString())}`;
            }
        }
        return url;
    }
}
