import { User } from 'oauth2-server';

export interface OAuthUser extends User {
    oauthId(): string;
}
