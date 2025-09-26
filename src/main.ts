import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './utils/common/filter/all-exceptions.filter';
import { seed } from './prisma-service/seed';

async function bootstrap() {
  // apply seed data
  await seed();

  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.json({ limit: '20mb' }));
  app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://xn--privestate-e7a.com',
    ],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Alvaaro Server')
    .setDescription('API description')
    .setVersion('1.0')
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

  app.use('/stripe/webhook', bodyParser.raw({ type: 'application/json' }));
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
