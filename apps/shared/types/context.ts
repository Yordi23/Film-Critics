import { JwtPayloadDto } from 'apps/shared/dtos/jwt-payload.dto';

export type Context = {
  user: JwtPayloadDto;
};
