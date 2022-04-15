import {
  Controller,
  Get,
  UploadedFile,
  Post,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Customer } from './customer.entity';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileFilter } from '@/middlewares/fileFilter';
import { createReadStream } from 'fs';
import { parse } from 'papaparse';

@Controller()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  getAll(): Promise<Customer[]> {
    return this.customersService.findAll();
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('csv', {
      fileFilter: FileFilter,
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    let errorChunks = [];

    const customersService = this.customersService;

    const config = {
      header: true,
      dynamicTyping: true,
      chunk: async function (result, parser) {
        parser.pause();
        const uploaded = await customersService.insertMany(result.data);
        if (!uploaded) {
          errorChunks = [...errorChunks, result.data];
        }
        parser.resume();
      },

      complete: function ({}, {}) {
        if (errorChunks.length == 0) {
          return 'Success';
        } else {
          console.log('Error Chunks', errorChunks);
        }
      },
    };

    /*   var p1 = new Promise((resolve, reject) => {} */

    parse(createReadStream(file.path), config);
  }
}
