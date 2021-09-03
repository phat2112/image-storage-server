import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/utils/file-helper';

@Controller('api/images')
export class ImageController {
  @Post('upload-image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File, @Body() body) {
    const response = {
      originalName: file.originalname,
      file: file.filename,
    };

    return response;
  }

  @Post('upload-avatar')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  uploadAvatar(@UploadedFile() file: Express.Multer.File, @Body() body) {
    console.log(`file`, file);
    console.log(`body`, body.name);
    const response = {
      originalName: file.originalname,
      file: file.filename,
    };

    return response;
  }

  @Get(':imgPath')
  sendImage(@Param('imgPath') image, @Res() res) {
    res.sendFile(image, { root: './public' });
  }
}
