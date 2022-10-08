import OAuth2Server = require('oauth2-server');
import { ExecutionContext } from '@nestjs/common';
import { Request, Response } from 'oauth2-server';

export class OAuth2GuardInteractor {
    constructor(private readonly oauthServer: OAuth2Server) {}

    public async execute(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();
        const oauthRequest = new Request(req);
        const oauthResponse = new Response(res);

        try {
            const token = await this.oauthServer.authenticate(oauthRequest, oauthResponse);

            Object.entries(oauthResponse.headers ?? {}).forEach(([key, value]) => {
                req.res.setHeader(key, value);
            });

            req.user = token.user;
            req.client = token.client;
            req.scope = token.scope;

            return true;
        } catch {
            return false;
        }
    }
}
