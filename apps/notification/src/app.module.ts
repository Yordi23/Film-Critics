import { Module } from '@nestjs/common';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./env/notification.env`,
      isGlobal: true,
    }),
    EmailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
