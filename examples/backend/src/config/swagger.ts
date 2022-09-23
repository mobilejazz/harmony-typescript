import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Environment } from './environment';
import { writeFileSync } from 'fs';

export function swaggerSetup(app: INestApplication) {
    const builder = new DocumentBuilder()
        .setTitle('Harmony Example')
        .setDescription('Backend API Documentation')
        .setVersion('0.1.0')
        .addServer(Environment.serverURL())
        .addBearerAuth({
            type: 'oauth2',
            flows: {
                clientCredentials: {
                    tokenUrl: Environment.serverURL() + '/auth/token',
                    scopes: {},
                },
                password: {
                    tokenUrl: Environment.serverURL() + '/auth/token',
                    scopes: {},
                },
            },
        });

    const options = builder.build();
    const document = SwaggerModule.createDocument(app, options);

    // Serializing swagger data into a file
    const path = __dirname + '/../../swagger.json';
    writeFileSync(path, JSON.stringify(document, null, 2));

    SwaggerModule.setup('doc', app, document);
}
