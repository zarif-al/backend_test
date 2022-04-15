import {
  Controller,
  Get,
  UploadedFile,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Customer } from './customer.entity';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileFilter } from '@/middlewares/fileFilter';
import { createReadStream, unlink } from 'fs';
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
    const customersService = this.customersService;

    return new Promise((resolve, reject) => {
      let errorChunks = [];
      let rowCount = 0;
      const config = {
        header: true,
        dynamicTyping: true,
        unlink: unlink,
        chunk: async function (result, parser) {
          parser.pause();

          const uploaded = await customersService.insertMany(result.data);

          if (uploaded.success === false) {
            const errorMsg = {
              type: 'DB Insert Error',
              code: 500,
              message:
                'The following chunk of rows could not be inserted due to faulty data.',
              rows: rowCount + ' to ' + (rowCount + result.data.length),
              rowFailed: uploaded.message,
            };

            errorChunks = [...errorChunks, errorMsg];
          }
          rowCount += result.data.length;

          parser.resume();
        },
        complete: function () {
          const msg = {
            message: errorChunks.length == 0 ? 'Success' : 'Some Failures',
            details: errorChunks,
          };

          this.unlink(file.path, (err) => {
            if (err) {
              console.error(err);
              return;
            }
          });

          resolve(msg);
        },
        error: function (error) {
          errorChunks = [...errorChunks, error];
          reject(error);
        },
      };

      parse(createReadStream(file.path), config);
    }).then(
      function onFulfilled(value) {
        return value; // Success!
      },

      function onRejected(reason) {
        return reason; // Error!
      },
    );
  }
}
