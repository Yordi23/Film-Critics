import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmMember } from './film-member.entity';
import { FilmMemberService } from './film-member.service';
import { FilmMemberController } from './FilmMemberController';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
  providers: [FilmMemberService, ,],
  controllers: [FilmMemberController],
  exports: [FilmMemberService],
})
export class FilmMemberModule {}
