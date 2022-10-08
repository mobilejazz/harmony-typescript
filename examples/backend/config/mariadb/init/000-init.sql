create database if not exists harmonyexample;

use harmonyexample;

create table if not exists user_roles
(
    id         int primary key,
    created_at timestamp(6) default current_timestamp(6)   not null,
    updated_at timestamp(6) on update current_timestamp(6) not null,
    name       varchar(50)                                 not null unique
);

create table if not exists user
(
    id                          int auto_increment primary key,
    created_at                  timestamp(6) default current_timestamp(6)   not null,
    updated_at                  timestamp(6) on update current_timestamp(6) not null,
    deleted_at                  timestamp(6)                                null,
    email                       varchar(100)                                not null unique,
    first_name                  varchar(100)                                not null,
    last_name                   varchar(100)                                not null,
    password_salt               varchar(80)                                 not null,
    password_hash_algorithm     varchar(50)                                 not null,
    role_id                     int                                         not null,
    foreign key (role_id) references user_roles (id)
);

create table if not exists user_token_validation
(
    id         int auto_increment primary key,
    created_at timestamp(6) default current_timestamp(6)   not null,
    updated_at timestamp(6) on update current_timestamp(6) not null,
    type       int                                         not null,
    user_id    int                                         not null,
    token      varchar(50)                                 not null,
    foreign key (user_id) references user (id) on delete cascade
);
