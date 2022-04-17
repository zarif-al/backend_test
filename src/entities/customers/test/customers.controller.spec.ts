import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from '@/entities/customers/customers.service';
import { CustomersController } from '@/entities/customers/customers.controller';
import { Customer } from '@/entities/customers/customer.entity';
import {
  customerStubs,
  customerInputStub,
} from '@/entities/customers/test/stubs/customer.stub';
import { sampleFile } from '@/entities/customers/test/stubs/file.stub';
import { join } from 'path';
import { DEFAULT_LIMIT } from '@/entities/customers/utils/defaults';
import { writeFile } from '@/utils/writeFile';

jest.mock('@/entities/customers/customers.service');

describe('CustomersController', () => {
  const offset = 0;
  const limit = 10;

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
    describe(`When getAll is called with query params offset=${offset}, limit=${limit}`, () => {
      let customers: Customer[];

      beforeEach(async () => {
        customers = await customersController.getAll(
          String(offset),
          String(limit),
        );
      });

      test(`then it should call customerService with offset=${offset} and limit=${limit}`, () => {
        expect(customersService.getAll).toHaveBeenCalledWith(offset, limit);
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

      test(`then it should call customerService with offset=0 and default limit=${DEFAULT_LIMIT}`, () => {
        expect(customersService.getAll).toHaveBeenCalledWith(0, DEFAULT_LIMIT);
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
            join(__dirname, 'tempStorage/sampleCSV.csv'),
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
            join(__dirname, 'tempStorage/sampleCSV.csv'),
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
