import OAuth2Server = require('oauth2-server');
import {ExecutionContext} from '@nestjs/common';
import {Request, Response} from 'oauth2-server';

export class OAuth2GuardInteractor {
    constructor(
        private readonly oauthServer: OAuth2Server,
    ) {}

    async execute(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();
        const oauthRequest = new Request(req);
        const oauthResponse = new Response(res);

        return this.oauthServer
            .authenticate(oauthRequest, oauthResponse)
            .then(token => {
                Object.keys(oauthResponse.headers).forEach(key => {
                    req.res.setHeader(key, oauthResponse.headers[key]);
                });
                req.user = token.user;
                req.client = token.client;
                req.scope = token.scope;
                return true;
            })
            .catch(error => {
                return false;
            });
    }
}
