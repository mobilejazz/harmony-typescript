import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { TypeORMSQLInterface } from '@mobilejazz/harmony-typeorm';
import { MySQLDialect, PostgresSQLDialect, SQLDialect } from '@mobilejazz/harmony-core';

export interface DatabaseModuleParams {
    dataSource: DataSource;
}

@Module({})
export class DatabaseModule {
    static forRoot(params: DatabaseModuleParams): DynamicModule {
        return {
            global: true,
            module: DatabaseModule,
            imports: [TypeOrmModule.forRoot(params.dataSource.options)],
            providers: [
                {
                    provide: 'SQLInterface',
                    inject: [EntityManager],
                    useFactory: (entityManager: EntityManager) => new TypeORMSQLInterface(entityManager),
                },
                {
                    provide: 'SQLDialect',
                    inject: [],
                    useFactory: (): SQLDialect => {
                        switch (params.dataSource.options.type) {
                            case 'mysql':
                            case 'mariadb':
                                return new MySQLDialect();

                            case 'postgres':
                                return new PostgresSQLDialect();
                        }

                        throw new Error(`Unsuported SQL connection type: ${params.dataSource.options.type}`);
                    },
                },
            ],
            exports: ['SQLInterface', 'SQLDialect'],
        };
    }
}
