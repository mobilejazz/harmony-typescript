import * as secrets from 'docker-secrets-nodejs';

import { DataSource } from 'typeorm';
import { Environment, EnvironmentType } from './environment';

const isDev = Environment.current() === EnvironmentType.Development;
const isLocal = Environment.current() === EnvironmentType.Local;
const isTS = !!process.env.IS_TS;

console.log('**** Environment: ', Environment.description(), ' ****');

const DOCKER_DB_NAME = 'mariadb';

const dataSource = new DataSource({
    name: 'default',
    type: 'mysql',
    host: isDev ? 'localhost' : DOCKER_DB_NAME,
    port: 3306,
    username: 'root',
    password: isDev ? 'test1234' : secrets.get('db-root-password'),
    database: 'harmonyexample',
    entities: isTS ? ['src/**/**.entity.ts'] : ['dist/**/**.entity.js'],
    synchronize: false,
    logging: isDev || isLocal,
    migrations: isTS
        ? ['src/data/migrations/*.ts']
        : ['dist/data/migrations/*.js'],
});

if (isDev || isLocal) {
    console.log('SQL Connection: ', dataSource.options);
}

export default dataSource;
