import { JwtPayloadDto } from 'shared/dtos/jwt-payload.dto';

export type Context = {
  user: JwtPayloadDto;
};
