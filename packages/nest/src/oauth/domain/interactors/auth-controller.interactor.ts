import OAuth2Server, { Request, Response } from 'oauth2-server';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

export class AuthControllerInteractor {
    constructor(private readonly oauthServer: OAuth2Server) {}

    public async execute(request: ExpressRequest, response: ExpressResponse): Promise<void> {
        const oauthRequest = new Request(request);
        const oauthResponse = new Response(response);

        if (oauthRequest.headers?.['content-type'] === 'application/json') {
            // This is a patch to support application/json
            oauthRequest.headers['content-type'] = 'application/x-www-form-urlencoded';
        }

        try {
            await this.oauthServer.token(oauthRequest, oauthResponse);
        } finally {
            Object.entries(oauthResponse.headers ?? {}).forEach(([key, value]) => {
                response.setHeader(key, value);
            });

            if (oauthResponse.status && oauthResponse.status >= 400) {
                // If error, always return `Forbidden`
                let error = oauthResponse.body?.error ? oauthResponse.body.error : 'Forbidden';
                let message = 'Forbidden access';

                if (typeof oauthResponse.body?.error_description === 'string') {
                    message = oauthResponse.body.error_description;
                } else if (
                    oauthResponse.body?.error_description?.error &&
                    oauthResponse.body?.error_description?.message
                ) {
                    error = oauthResponse.body.error_description.error;
                    message = oauthResponse.body.error_description.message;
                }

                response.status(403);
                response.send({ error, message });
            } else {
                // Otherwise, returning the corresponding status
                response.status(oauthResponse.status as number);
                response.send(oauthResponse.body);
            }
        }
    }
}
