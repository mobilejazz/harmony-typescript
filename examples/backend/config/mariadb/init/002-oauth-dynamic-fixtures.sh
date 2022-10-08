APP_CLIENT_SECRET=$(cat /run/secrets/app-client-secret)
APP_CLIENT_ID=$(cat /run/secrets/app-client)

echo "
insert into oauth_client (client_id, client_secret) values ('${APP_CLIENT_ID}', '${APP_CLIENT_SECRET}')
" > /docker-entrypoint-initdb.d/003-oauth-fixtures.sql
