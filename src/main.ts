import { INestMicroservice, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getGRPC } from './helpers/setup';

async function bootstrap() {
  const app: INestMicroservice = await NestFactory.createMicroservice(
    AppModule,
    getGRPC(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { exposeDefaultValues: true },
    }),
  );

  await app.listen().then(() => {
    console.log(`start ${process.env.DOMAIN_NAME} at port ${process.env.PORT}`);
  });
}

bootstrap();
