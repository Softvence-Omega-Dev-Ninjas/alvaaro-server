import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './utils/common/filter/all-exceptions.filter';
import appMetadata from './app-metadata/app-metadata';
import { static as serverFile } from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    bodyParser: true,
  });

  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://priveestate.es',
    ],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle(appMetadata.displayName)
    .setDescription(appMetadata.description)
    .setVersion(appMetadata.version)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'bearer',
      },
      'access-token',
    )
    .build();

  const documentFactory = SwaggerModule.createDocument(app, config);

  documentFactory.paths = Object.fromEntries(
    Object.entries(documentFactory.paths).map(([path, ops]) => [
      path,
      Object.fromEntries(
        Object.entries(ops).map(([method, op]) => [
          method,
          {
            ...op,
            security: [{ 'access-token': [] }],
          },
        ]),
      ),
    ]),
  );

  SwaggerModule.setup('api', app, documentFactory);

  app.use('/uploads', serverFile(join(process.cwd(), 'public', 'uploads')));
  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`⚡Server is running on port: http://localhost:${process.env.PORT ?? 3000}/api`);
  });
}
void bootstrap();
