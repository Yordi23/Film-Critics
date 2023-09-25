import { ConfigModule, ConfigService } from '@nestjs/config';

export const jwtModuleConfig = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    global: true,
    secret: configService.get<string>('JWT_SECRET'),
    signOptions: { expiresIn: '60s' },
  }),
  inject: [ConfigService],
};
