import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { ReviewService } from './review.service';
import { JwtModule } from '@nestjs/jwt';
import { ReviewController } from './review.controller';
import { FilmModule } from '../film/film.module';
import { UserModule } from '../user/user.module';
import { jwtModuleConfig } from 'shared/config/jwt-module.config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
    JwtModule.registerAsync(jwtModuleConfig),
    ClientsModule.registerAsync({
      clients: [
        {
          imports: [ConfigModule],
          name: 'FILM_CRITIC_SERVICE',
          useFactory: async (configService: ConfigService) => ({
            transport: Transport.NATS,
            options: {
              servers: [configService.get<string>('NATS_HOST')],
            },
          }),
          inject: [ConfigService],
        },
      ],
    }),
    FilmModule,
    UserModule,
  ],
  providers: [ReviewService],
  controllers: [ReviewController],
  exports: [ReviewService],
})
export class ReviewModule {}
