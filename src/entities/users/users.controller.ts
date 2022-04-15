import {
  Controller,
  Get,
  UploadedFile,
  Post,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileFilter } from '@/middlewares/fileFilter';
import { createReadStream } from 'fs';
import { parse } from 'csv-parse';

@Controller()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('csv', {
      fileFilter: FileFilter,
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const usersArray = [];

    createReadStream(file.path)
      .pipe(
        parse({ columns: true }, function (err, {}) {
          if (err) {
            throw new BadRequestException(err.message);
          }
        }),
      )
      .on('data', function (row) {
        usersArray.push(row);
      })
      .on('end', function () {
        console.log(usersArray);
      });
  }
}
