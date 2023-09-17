import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/user.entity';
import { SignInDto } from './dtos/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { SignedUserDto } from './dtos/signed-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 12);
    createUserDto.role = 'USER';

    return this.userService.create(createUserDto);
  }

  async signIn(signInDto: SignInDto): Promise<SignedUserDto> {
    const user = await this.userService.findOneByEmail(signInDto.email);

    if (
      !user ||
      !(await this.isValidPassword(signInDto.password, user.password))
    ) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const payload = { email: user.email, id: user.id, role: user.role };

    return {
      user,
      jwt: await this.jwtService.signAsync(payload),
    };
  }

  private async isValidPassword(
    inputPassword: string,
    storedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(inputPassword, storedPassword);
  }
}
