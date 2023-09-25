import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film } from './film.entity';
import { FilmService } from './film.service';
import { FilmController } from './film.controller';
import { JwtModule } from '@nestjs/jwt';
import { FilmMemberModule } from '../film-member/film-member.module';
import { jwtModuleConfig } from 'apps/shared/config/jwt-module.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Film]),
    JwtModule.registerAsync(jwtModuleConfig),
    FilmMemberModule,
  ],
  providers: [FilmService],
  controllers: [FilmController],
  exports: [FilmService],
})
export class FilmModule {}
