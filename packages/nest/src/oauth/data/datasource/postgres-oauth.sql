-- Function to update the update_at column
CREATE OR REPLACE FUNCTION oauth_update_modified_column()
    RETURNS TRIGGER AS
$$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- OAuth Client Table
create table if not exists oauth_client
(
    id                     serial primary key,
    created_at             timestamp(6) default now() not null,
    updated_at             timestamp(6) default now() not null,
    client_id              varchar(100)               not null,
    client_secret          varchar(100)               not null,
    access_token_lifetime  int                        null,
    refresh_token_lifetime int                        null
);

create trigger update_oauth_client_update_at
    before update
    on oauth_client
    for each row
execute procedure oauth_update_modified_column();

insert into oauth_client (client_id, client_secret)
values ('application', 'secret');

-- OAuth Client Grant Table
create table if not exists oauth_client_grant
(
    id         serial primary key,
    created_at timestamp(6) default now() not null,
    updated_at timestamp(6) default now() not null,
    grant_name varchar(50)                not null,
    client_id  int,
    foreign key (client_id) references oauth_client (id) on delete cascade,
    unique (client_id, grant_name)
);

create trigger update_oauth_client_grant_update_at
    before update
    on oauth_client_grant
    for each row
execute procedure oauth_update_modified_column();

insert into oauth_client_grant (grant_name, client_id)
values ('password', 1),
       ('refresh_token', 1),
       ('client_credentials', 1);

-- OAuth Token Table
create table if not exists oauth_token
(
    id                       serial primary key,
    created_at               timestamp(6) default now() not null,
    updated_at               timestamp(6) default now() not null,
    access_token             varchar(100)               not null,
    access_token_expires_at  timestamp(6)               not null,
    refresh_token            varchar(100)               null,
    refresh_token_expires_at timestamp(6)               null,
    client_id                int,
    foreign key (client_id) references oauth_client (id)
);

create trigger update_oauth_token_update_at
    before update
    on oauth_token
    for each row
execute procedure oauth_update_modified_column();

-- OAuth User Info Table
create table if not exists oauth_user_info
(
    id         serial primary key,
    created_at timestamp(6) default now() not null,
    updated_at timestamp(6) default now() not null,
    user_id    varchar(36)                not null,
    token_id   int,
    foreign key (token_id) references oauth_token (id) on delete cascade,
    unique (user_id, token_id)
);

create trigger update_oauth_user_info_update_at
    before update
    on oauth_user_info
    for each row
execute procedure oauth_update_modified_column();

-- OAuth Token Scope Table
create table if not exists oauth_token_scope
(
    id         serial primary key,
    created_at timestamp(6) default now() not null,
    updated_at timestamp(6) default now() not null,
    scope      varchar(50)                not null,
    token_id   int,
    foreign key (token_id) references oauth_token (id) on delete cascade,
    unique (scope, token_id)
);

create trigger update_oauth_token_scope_update_at
    before update
    on oauth_token_scope
    for each row
execute procedure oauth_update_modified_column();
