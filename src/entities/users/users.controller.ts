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
/* import { parse } from 'csv-parse'; */
import { parse } from 'papaparse';
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
    const config = {
      header: true,
      chunk: function (result, parser) {
        usersArray.push(result.data);
      },
      complete: function (results, parser) {
        console.log(usersArray);
      },
    };
    parse(createReadStream(file), config);
  }
}
