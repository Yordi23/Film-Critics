import { JwtPayloadDto } from 'apps/auth/src/auth/dtos/jwt-payload.dto';

export type Context = {
  user: JwtPayloadDto;
};
