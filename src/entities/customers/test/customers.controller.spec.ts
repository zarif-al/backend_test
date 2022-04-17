import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from '@/entities/customers/customers.service';
import { CustomersController } from '@/entities/customers/customers.controller';
import { Customer } from '@/entities/customers/customer.entity';
import {
  customerStubs,
  customerInputStub,
} from '@/entities/customers/test/stubs/customer.stub';
import { sampleFile } from '@/entities/customers/test/stubs/file.stub';
import { writeFileSync } from 'fs';
import { unparse } from 'papaparse';
import { join } from 'path';

jest.mock('@/entities/customers/customers.service');

function writeFile() {
  const csv = unparse([customerInputStub()]);
  writeFileSync(join(__dirname, 'stubs/sampleCSV.csv'), csv);
}

describe('CustomersController', () => {
  let customersService: CustomersService;
  let customersController: CustomersController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [CustomersService],
      controllers: [CustomersController],
    }).compile();

    customersService = moduleRef.get<CustomersService>(CustomersService);
    customersController =
      moduleRef.get<CustomersController>(CustomersController);

    jest.clearAllMocks();
  });

  describe('Initization', () => {
    describe('When test is initialized', () => {
      test('customersController should be defined', () => {
        expect(customersController).toBeDefined();
      });
      test('customersService should be defined', () => {
        expect(customersService).toBeDefined();
      });
    });
  });

  describe('GetAll', () => {
    describe('When getAll is called with query params', () => {
      let customers: Customer[];

      beforeEach(async () => {
        customers = await customersController.getAll('0', '10');
      });

      test('then it should call customerService with correct offset and limit', () => {
        expect(customersService.getAll).toHaveBeenCalledWith(0, 10);
      });

      test('then it should return an array of customers', () => {
        expect(customers).toEqual(customerStubs());
      });
    });

    describe('When getAll is called without query params', () => {
      let customers: Customer[];

      beforeEach(async () => {
        customers = await customersController.getAll(undefined, undefined);
      });

      test('then it should call customerService with default offset and limit', () => {
        expect(customersService.getAll).toHaveBeenCalledWith(0, 100);
      });

      test('then it should return an array of customers', () => {
        expect(customers).toEqual(customerStubs());
      });
    });
  });

  describe('Upload File', () => {
    describe('When uploadFile is called with a valid file', () => {
      let response;

      beforeEach(async () => {
        writeFile();
        response = await customersController.uploadFile(
          sampleFile(
            join(__dirname, 'stubs/sampleCSV.csv'),
          ) as Express.Multer.File,
        );
      });

      test('then it should call customerService with an array of customer input objects', () => {
        expect(customersService.insertMany).toHaveBeenCalledWith([
          customerInputStub(),
        ]);
      });

      test('then it should return a success message', () => {
        expect(response).toEqual({
          message: 'Success',
          code: 200,
          details: [],
        });
      });
    });

    describe('When uploadFile is called with an invalid file', () => {
      let response;

      beforeEach(async () => {
        response = await customersController.uploadFile(
          sampleFile(
            join(__dirname, 'stubs/sampleCSV.csv'),
          ) as Express.Multer.File,
        );
      });

      test('then it should not call customerService', () => {
        expect(customersService.insertMany).not.toHaveBeenCalled();
      });

      test('then it should return a failure message', () => {
        expect(response.message).toEqual('Parser Error');
        expect(response.code).toEqual(500);
      });
    });
  });
});
