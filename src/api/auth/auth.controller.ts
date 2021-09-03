import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import CommonError from '../../lib/error';
import { transportEmail } from '../../lib/email-verify';
import {
  AuthenticationDto,
  VerifiedEmailDto,
  ResetPasswordDto,
} from '../../dto/authentication.dto';
import { CreateUserDto, UserDto } from '../../dto/user.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() request: AuthenticationDto, @Res() res: Response) {
    try {
      const user = await this.authService.findUserByEmail(request.email);
      const token = await this.authService.getUserToken(user.userId);
      user.password = undefined;
      return res.status(200).send({ data: { ...user, token } });
    } catch (err) {
      if (err instanceof CommonError) {
        return res.status(err.code).send({ data: { err: err.message } });
      }
      return res.status(500).send({ data: { err: err.message } });
    }
  }

  @Post('current-user')
  async getCurrentUser(@Body() req: { token: string }, @Res() res: Response) {
    try {
      const base64Url = req.token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const buff = new Buffer(base64, 'base64');
      const payloadInit = buff.toString('ascii');
      const payload = JSON.parse(payloadInit);

      const userFound = await this.userService.getById(payload.userId);
      return res.status(200).send({ data: { ...userFound, token: req.token } });
    } catch (err) {
      if (err instanceof CommonError) {
        return res.status(err.code).send({ data: { err: err.message } });
      }
      return res.status(500).send({ data: { err: err.message } });
    }
  }

  @Post('register')
  async createUser(@Body() req: CreateUserDto, @Res() res: Response) {
    try {
      const emailExisted = await this.userService.getByEmail(req.email);
      if (emailExisted)
        return res.status(400).send({ data: { msg: 'User is existed' } });
      const createdUser = await this.userService.createUser(req);
      if (createdUser) {
        return res.status(200).send({
          data: { msg: 'Created user successfully', isRegistered: true },
        });
      }
    } catch (err) {
      if (err instanceof CommonError) {
        return res.status(err.code).send({ data: { err: err.message } });
      }
      return res.status(500).send({ data: { err: err.message } });
    }
  }

  @Post('email-verified')
  async forgotPassword(@Body() req: VerifiedEmailDto, @Res() res: Response) {
    const currentUser = await this.userService.getByEmail(req.email);
    const link = `http://localhost:3000/${currentUser.userId}/reset-password`;
    const mailOptions = {
      to: req.email,
      subject: 'Please confirm your Email account',
      html:
        'Hello,<br> Please Click on the link to verify your email.<br><a href=' +
        link +
        '>Click here to verify</a>',
    };

    transportEmail.sendMail(mailOptions, (err) => {
      if (err) {
        console.log(`error`, err);
      } else {
        res.status(200).send({
          data: {
            message: 'reset email success',
          },
        });
      }
    });
  }

  @Post('reset-password')
  async resetPassword(@Body() req: ResetPasswordDto, @Res() res: Response) {
    try {
      const { newPassword, password, userId } = req;
      const currentUser = await this.userService.getById(userId);
      if (newPassword === password)
        return res.status(400).send({
          data: {
            message: "new password can't be same as old one",
            isResetPassword: true,
          },
        });

      await this.userService.updateUserPassword({
        ...currentUser,
        password: newPassword,
      });
      return res
        .status(200)
        .send({ data: { message: 'Password updated successfully' } });
    } catch (err) {
      if (err instanceof CommonError) {
        return res.status(err.code).send({ data: { err: err.message } });
      }
      return res.status(500).send({ data: { err: err.message } });
    }
  }
}
