import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const NATS_HOST = configService.get<string>('NATS_HOST');
  const PORT = configService.get<number>('PORT');

  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.NATS,
      options: {
        servers: [NATS_HOST],
      },
    });

  await microservice.listen();
  await app.listen(PORT);
}
bootstrap();
