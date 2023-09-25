import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmMember } from './film-member.entity';
import { FilmMemberService } from './film-member.service';
import { JwtModule } from '@nestjs/jwt';
import { FilmMemberController } from './film-member.controller';
import { jwtModuleConfig } from 'apps/shared/config/jwt-module.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([FilmMember]),
    JwtModule.registerAsync(jwtModuleConfig),
  ],
  providers: [FilmMemberService],
  controllers: [FilmMemberController],
  exports: [FilmMemberService],
})
export class FilmMemberModule {}
