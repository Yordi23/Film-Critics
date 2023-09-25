import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { ReviewService } from './review.service';
import { JwtModule } from '@nestjs/jwt';
import { ReviewController } from './review.controller';
import { FilmModule } from '../film/film.module';
import { UserModule } from '../user/user.module';
import { jwtModuleConfig } from 'apps/shared/config/jwt-module.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
    JwtModule.registerAsync(jwtModuleConfig),
    FilmModule,
    UserModule,
  ],
  providers: [ReviewService],
  controllers: [ReviewController],
  exports: [ReviewService],
})
export class ReviewModule {}
