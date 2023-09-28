import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { jwtModuleConfig } from 'shared/config/jwt-module.config';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync(jwtModuleConfig),
    ClientsModule.registerAsync({
      clients: [
        {
          imports: [ConfigModule],
          name: 'AUTH_SERVICE',
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
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
