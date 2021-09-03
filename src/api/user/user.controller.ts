import {
  Body,
  Controller,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { Response } from 'express';
import {
  editFileName,
  imageFileFilter,
  storageFolder,
} from '../../utils/file-helper';
import { UserDto } from '../../dto/user.dto';
import CommonError from '../../lib/error';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('search-user')
  async searchUser(
    @Body() request: { searchKey: string },
    @Res() res: Response,
  ) {
    try {
      const users = await this.userService.searchUser(request.searchKey);
      const newFormatUser = users.map((user) => ({
        ...user,
        password: undefined,
      }));
      return res.status(200).send({ data: newFormatUser });
    } catch (err) {
      if (err instanceof CommonError) {
        return res.status(err.code).send({ data: { err: err.message } });
      }
      return res.status(500).send({ data: { err: err.message } });
    }
  }

  @Post('update-user/:id')
  @UseInterceptors(
    FilesInterceptor('image[]', 2, {
      storage: diskStorage({
        destination: storageFolder,
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async updateUser(@Body() req: UserDto, @Res() res: Response) {
    try {
      const newUser = await this.userService.updateUser(req);
      if (newUser) {
        return res.status(200).send({
          data: {
            message: 'user is updated successfully',
            isUpdated: newUser.isUpdateInfo,
          },
        });
      }
    } catch (err) {
      if (err instanceof CommonError) {
        return res.status(err.code).send({ data: { err: err.message } });
      }
      return res.status(500).send({ data: { err: err.message } });
    }
  }
}
