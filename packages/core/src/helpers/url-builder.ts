import { Dictionary } from '../data';
import { ParameterType } from '../data/parameter-type';

export class UrlBuilder {

    constructor(
        private url: string,
    ) {}

    public getUrl(): string {
        return this.url;
    }

    public setUrlParameters(urlParameters: Dictionary<ParameterType>): UrlBuilder {
        this.url = this.prepareUrlParameters(this.url, urlParameters);
        return this;
    }

    public setQueryParameters(queryParameters: Dictionary<ParameterType>): UrlBuilder {
        this.url = this.prepareQueryParameters(this.url, queryParameters);
        return this;
    }

    private prepareUrlParameters(url: string, urlParameters: Dictionary<ParameterType>): string {
        for (let property in urlParameters ) {
            if (urlParameters.hasOwnProperty(property) && url.indexOf(`:${property}`) > -1) {
                url = url.replace(`:${property}`, urlParameters[property].toString());
            } else {
                throw new Error(`Parameter "${property}" does not exist in URL "${url}"`);
            }
        }
        return url;
    }

    private prepareQueryParameters(url: string, queryParameters: Dictionary<ParameterType>): string {
        let firstProperty = true;

        for (let property in queryParameters) {
            if (
                queryParameters.hasOwnProperty(property) &&
                (typeof queryParameters[property] !== 'undefined' && queryParameters[property] !== null)
            ) {
                url += firstProperty ? '?' : '&';
                firstProperty = false;
                url += `${property}=${encodeURIComponent(queryParameters[property].toString())}`;
            }
        }
        return url;
    }

}
