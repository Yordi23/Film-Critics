import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmMember } from './film-member.entity';
import { FilmMemberService } from './film-member.service';
import { FilmMemberController } from './film-member.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'apps/auth/src/auth/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([FilmMember]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60s' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    FilmMemberService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [FilmMemberController],
  exports: [FilmMemberService],
})
export class FilmMemberModule {}
