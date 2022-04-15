import {
  Controller,
  Get,
  UploadedFile,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }
}
