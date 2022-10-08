-- OAuth Fixtures
insert into oauth_client_grant (grant_name, client_id)
values ('password', 1),
       ('refresh_token', 1),
       ('client_credentials', 1);

-- OAuth Fixtures
insert into user_roles (id, name)
values (1, 'admin');

insert into user (email, first_name, last_name, password_salt, password_hash_algorithm, role_id)
values ('admin@example.com', 'Harmony', 'Admin', '$2a$05$BvE1HhylS/Un7c.Xn02OPe3B8zdx82wJnUUr186k4fOTyypv0DhMq', 'bcryptjs::hash_it5', 1);
