import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmMember } from './film-member/film-member.entity';
import { FilmMemberModule } from './film-member/film-member.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./apps/film-critic/.env`,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [FilmMember],
      synchronize: true,
    }),
    FilmMemberModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
