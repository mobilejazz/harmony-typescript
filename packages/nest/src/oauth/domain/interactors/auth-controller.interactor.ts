import {Request, Response} from "oauth2-server";
import OAuth2Server = require("oauth2-server");
import {FailedError, ForbiddenError} from "@mobilejazz/harmony-core";
import {BadRequestException, ForbiddenException} from "@nestjs/common";

export class InvalidRefreshTokenError extends ForbiddenException {
    constructor() {
        super('Invalid refresh token');
        Object.setPrototypeOf(this, InvalidRefreshTokenError.prototype);
    }
}

export class InvalidGrantError extends BadRequestException {
    constructor() {
        super('Invalid grant error');
        Object.setPrototypeOf(this, InvalidGrantError.prototype);
    }
}

export class InvalidClientError extends BadRequestException {
    constructor() {
        super('Invalid client error');
        Object.setPrototypeOf(this, InvalidClientError.prototype);
    }
}

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

        return new Promise<void>((resolve, reject) => {
            this.oauthServer.token(
                oauthRequest,
                oauthResponse,
                null,
                () => {
                    if (oauthResponse.status < 400) {
                        response.status(oauthResponse.status);
                        Object.keys(oauthResponse.headers).forEach(key => {
                            response.setHeader(key, oauthResponse.headers[key]);
                        });
                        response.send(oauthResponse.body);
                    }
                },
            ).then(result => {
                // Successful result is already handled in the callback
            }).catch(error => {
                if (error.name === 'invalid_grant') {
                    // Catching the invalid grant error from OAuth2Server
                    reject(new InvalidGrantError());
                } else if (error.name === 'invalid_client') {
                    // Catching the invalid client error from OAuth2Server
                    reject(new InvalidClientError());
                } else if (error.message.message === 'Invalid refresh token') {
                    // Catching the invalid refresh_token error from OAuth2Server
                    reject(new InvalidRefreshTokenError());
                } else {
                    // Return whatever error otherwise
                    reject(error);
                }
            });
        });
    }
}
