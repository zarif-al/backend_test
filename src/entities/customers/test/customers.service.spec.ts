import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from '@/entities/customers/customers.service';
import { Customer } from '@/entities/customers/customer.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  customerStubs,
  customerInputStub,
  customerStub,
} from '@/entities/customers/test/stubs/customer.stub';
import { Repository } from 'typeorm';

describe('CustomersService', () => {
  const offset = 0;
  const limit = 10;

  let customersService: CustomersService;
  let customersRepository: Repository<Customer>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getRepositoryToken(Customer),
          useValue: {
            find: jest.fn().mockResolvedValue(customerStubs()),
            create: jest.fn().mockReturnValue(customerStub()),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    customersService = moduleRef.get<CustomersService>(CustomersService);
    customersRepository = moduleRef.get<Repository<Customer>>(
      getRepositoryToken(Customer),
    );
  });

  describe('Initization', () => {
    describe('When test is initialized', () => {
      test('then customersService should be defined', () => {
        expect(customersService).toBeDefined();
      });
    });
  });

  describe('GetAll', () => {
    describe(`When getAll is called with offset ${offset} and limit ${limit}`, () => {
      let customers: Customer[];

      beforeEach(async () => {
        customers = await customersService.getAll(offset, limit);
      });

      test(`then it should call customerRepositry.find method with enabled = true, skip = ${offset}, limit = ${limit}`, () => {
        expect(customersRepository.find).toHaveBeenCalledWith({
          where: {
            enabled: true,
          },
          skip: offset,
          take: limit,
        });
      });

      test('then it should return a list of customers', () => {
        expect(customers).toEqual(customerStubs());
      });
    });
  });

  describe('InsertMany', () => {
    describe('When insertMany is called with an array of 1 customer dto object', () => {
      let response;

      beforeEach(async () => {
        response = await customersService.insertMany([customerInputStub()]);
      });

      test('then it should call customerRepositry.create method with customer entity object created from input', () => {
        expect(customersRepository.create).toHaveBeenCalledWith(customerStub());
      });

      test('then it should call customerRepositry.save method with an array of customer entity objects', () => {
        expect(customersRepository.save).toHaveBeenCalledWith([customerStub()]);
      });

      test('then it should return a list of customers', () => {
        expect(response).toEqual({ success: true, message: [''] });
      });
    });
  });
});
