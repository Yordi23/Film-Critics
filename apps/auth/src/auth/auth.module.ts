import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AdminUserDatabaseSeeder } from './config/admin-user.seeder';
import { jwtModuleConfig } from 'shared/config/jwt-module.config';

@Module({
  imports: [JwtModule.registerAsync(jwtModuleConfig), UserModule],
  providers: [AuthService, AdminUserDatabaseSeeder],
  controllers: [AuthController],
})
export class AuthModule {}
