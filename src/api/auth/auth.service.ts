import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async findUserByEmail(email: string) {
    const user = await this.userService.getByEmail(email);

    if (!user) {
      throw new HttpException('User was not found...', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async verifyPassword(orgPassword: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(
      orgPassword,
      hashedPassword,
    );

    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credetials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getUserToken(userId: string) {
    const payload = { userId };
    return this.jwtService.sign(payload);
  }
}
