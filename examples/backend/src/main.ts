import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Environment, EnvironmentType } from './config/environment';
import { swaggerSetup } from './config/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Handle Errors
  // app.useGlobalFilters(
  //   new HttpExceptionFilter(
  //     new ErrorToHttpExceptionMapper(),
  //     await app.resolve(I18nService)
  //   )
  // );

  if (Environment.current() !== EnvironmentType.Production) {
    // Disable CORS
    app.enableCors({ origin: '*' });

    // Setup Swagger
    swaggerSetup(app);
  }

  await app.listen(3000);
}

bootstrap();
