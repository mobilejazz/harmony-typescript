import { Request, Response } from 'oauth2-server';
import OAuth2Server = require('oauth2-server');

export class AuthControllerInteractor {
    constructor(private readonly oauthServer: OAuth2Server) {}

    async execute(request: any, response: any): Promise<void> {
        const oauthRequest = new Request(request);
        const oauthResponse = new Response(response);

        if (oauthRequest.headers['content-type'] === 'application/json') {
            // This is a patch to support application/json
            oauthRequest.headers['content-type'] = 'application/x-www-form-urlencoded';
        }

        await this.oauthServer.token(oauthRequest, oauthResponse, null, () => {
            Object.keys(oauthResponse.headers).forEach((key) => {
                response.setHeader(key, oauthResponse.headers[key]);
            });

            if (oauthResponse.status >= 400) {
                // If error, always returning Forbidden
                let error = oauthResponse.body.error ? oauthResponse.body.error : 'Forbidden';
                let message = 'Forbidden access';
                if (typeof oauthResponse.body.error_description === 'string') {
                    message = oauthResponse.body.error_description;
                    // tslint:disable-next-line:max-line-length
                } else if (oauthResponse.body.error_description.error && oauthResponse.body.error_description.message) {
                    error = oauthResponse.body.error_description.error;
                    message = oauthResponse.body.error_description.message;
                }
                response.status(403);
                response.send({
                    error: error,
                    message: message,
                });
            } else {
                // Otherwise, returning the corresponding status
                response.status(oauthResponse.status);
                response.send(oauthResponse.body);
            }
        });
    }
}
