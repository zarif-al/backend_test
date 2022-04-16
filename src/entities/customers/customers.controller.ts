import {
  Controller,
  Get,
  UploadedFile,
  Post,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
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

  @Get('customers')
  getAll(@Req() request: Request): Promise<Customer[]> {
    const { offset = 0, limit = 100 } = request.query;
    return this.customersService.getAll(Number(offset), Number(limit));
  }

  @Post('import-customers')
  @UseInterceptors(
    FileInterceptor('csv', {
      fileFilter: FileFilter,
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const customersService = this.customersService;

    return new Promise((resolve, reject) => {
      let errors = [];
      let rowCount = 0;

      const PARSER_CONFIGURATION = {
        delimiter: ',',
        header: true,
        dynamicTyping: true,
        unlink: unlink,
        chunk: async function (result, parser) {
          parser.pause();

          const uploadResponse = await customersService.insertMany(result.data);

          if (uploadResponse.success === false) {
            const errorMsg = {
              type: 'DB Error',
              message:
                'The following chunk of rows could not be inserted due to faulty data.',
              rows: rowCount + ' to ' + (rowCount + result.data.length),
              failureSource: uploadResponse.message,
            };

            errors = [...errors, errorMsg];
          }

          rowCount += result.data.length;

          parser.resume();
        },
        complete: function () {
          this.unlink(file.path, (err) => {
            if (err) {
              console.error(err);
              return;
            }
          });

          resolve({
            message: errors.length == 0 ? 'Success' : 'Some Failures',
            code: 200,
            details: errors,
          });
        },
        error: function (error) {
          errors = [...errors, error];

          reject({
            message: 'Parser Error',
            code: 500,
            details: errors,
          });
        },
      };

      parse(createReadStream(file.path), PARSER_CONFIGURATION);
    })
      .then((value) => {
        return value;
      })
      .catch((err) => {
        return err;
      });
  }
}
