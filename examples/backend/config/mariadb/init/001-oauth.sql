create table if not exists oauth_client
(
    id            int auto_increment primary key,
    created_at    timestamp(6) default current_timestamp(6)   not null,
    updated_at    timestamp(6) on update current_timestamp(6) not null,
    client_id     varchar(100)                                not null,
    client_secret varchar(100)                                not null,
    access_token_lifetime int                                 null,
    refresh_token_lifetime int                                null
);

create table if not exists oauth_client_grant
(
    id            int auto_increment primary key,
    created_at    timestamp(6) default current_timestamp(6)   not null,
    updated_at    timestamp(6) on update current_timestamp(6) not null,
    grant_name    varchar(50)                                 not null,
    client_id     int                                         not null,
    foreign key (client_id) references oauth_client(id) on delete cascade,
    unique key client_id_grant_name (client_id, grant_name)
);

create table if not exists oauth_token
(
    id            int auto_increment primary key,
    created_at    timestamp(6) default current_timestamp(6)   not null,
    updated_at    timestamp(6) on update current_timestamp(6) not null,
    access_token  varchar(100)                                not null,
    access_token_expires_at timestamp(6)                      not null,
    refresh_token varchar(100)                                null,
    refresh_token_expires_at timestamp(6)                     null,
    client_id     int                                         not null,
    foreign key(client_id) references oauth_client(id) on delete cascade
);

create table if not exists oauth_user_info
(
    id            int auto_increment primary key,
    created_at    timestamp(6) default current_timestamp(6)   not null,
    updated_at    timestamp(6) on update current_timestamp(6) not null,
    user_id       varchar(36)                                 not null,
    token_id      int                                         not null,
    foreign key (token_id) references oauth_token(id) on delete cascade,
    unique key user_id_token_id (user_id, token_id)
);

create table if not exists oauth_token_scope
(
    id            int auto_increment primary key,
    created_at    timestamp(6) default current_timestamp(6)   not null,
    updated_at    timestamp(6) on update current_timestamp(6) not null,
    scope         varchar(50)                                 not null,
    token_id      int                                         not null,
    foreign key (token_id) references oauth_token(id) on delete cascade,
    unique key scope_token_id (scope, token_id)
);
