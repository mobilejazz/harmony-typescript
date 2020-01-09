import {Request, Response} from "oauth2-server";
import OAuth2Server = require("oauth2-server");

export class AuthControllerInteractor {
    constructor(
        private readonly oauthServer: OAuth2Server,
    ) {}

    async execute(request: any, response: any): Promise<void> {
        const oauthRequest = new Request(request);
        const oauthResponse = new Response(response);

        if (oauthRequest.headers['content-type'] === 'application/json') {
            // This is a patch to support application/json
            oauthRequest.headers['content-type'] = 'application/x-www-form-urlencoded';
        }

        await this.oauthServer.token(
            oauthRequest,
            oauthResponse,
            null,
            () => {
                response.status(oauthResponse.status);
                Object.keys(oauthResponse.headers).forEach(key => {
                    response.setHeader(key, oauthResponse.headers[key]);
                });
                response.send(oauthResponse.body);
            },
        );
    }
}
