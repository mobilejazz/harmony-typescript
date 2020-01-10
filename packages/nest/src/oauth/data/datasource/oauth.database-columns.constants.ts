export const OAuthColumnId = 'id';
export const OAuthColumnCreatedAt = 'created_at';
export const OAuthColumnUpdatedAt = 'updated_at';

export const OAuthClientTableName = 'oauth_client';
export const OAuthClientColumnClientId = 'client_id';
export const OAuthClientColumnClientSecret = 'client_secret';
export const OAuthClientColumnAccessTokenLifetime = 'access_token_lifetime';
export const OAuthClientColumnRefreshTokenLifetime = 'refresh_token_lifetime';

export const OAuthClientGrantTableName = 'oauth_client_grant';
export const OAuthClientGrantColumnGrantName = 'grant_name';
export const OAuthClientGrantColumnClientId = 'client_id';

export const OAuthTokenScopeTableName = 'oauth_token_scope';
export const OAuthTokenScopeColumnScope = 'scope';
export const OAuthTokenScopeColumnTokenId = 'token_id';

export const OAuthTokenTableName = 'oauth_token';
export const OAuthTokenColumnAccessToken = 'access_token';
export const OAuthTokenColumnRefreshToken = 'refresh_token';
export const OAuthTokenColumnAccessTokenExpiresAt = 'access_token_expires_at';
export const OAuthTokenColumnRefreshTokenExpiresAt = 'refresh_token_expires_at';
export const OAuthTokenColumnClientId = 'client_id';

export const OAuthUserInfoTableName = 'oauth_user_info';
export const OAuthUserInfoColumnTokenId = 'token_id';
export const OAuthUserInfoColumnUserId = 'user_id';
