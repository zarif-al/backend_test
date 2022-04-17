import {
  Controller,
  Get,
  UploadedFile,
  Post,
  UseInterceptors,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Customer } from './customer.entity';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileFilter } from '@/middlewares/fileFilter';
import { createReadStream, unlink } from 'fs';
import { parse } from 'papaparse';
import { DEFAULT_LIMIT } from '@/entities/customers/utils/defaults';

@Controller()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('customers')
  getAll(
    @Query('offset') offset: string,
    @Query('limit') limit: string,
  ): Promise<Customer[]> {
    const offsetNumber = offset !== undefined ? Number(offset) : 0;
    const limitNumber = limit !== undefined ? Number(limit) : DEFAULT_LIMIT;

    if (
      isNaN(offsetNumber) ||
      isNaN(limitNumber) ||
      limitNumber < 0 ||
      offsetNumber < 0
    ) {
      throw new BadRequestException('Invalid offset or limit');
    } else {
      return this.customersService.getAll(offsetNumber, limitNumber);
    }
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
