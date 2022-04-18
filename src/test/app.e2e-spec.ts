import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import {
  customerOutputStub,
  customerDirtyInputStub,
} from '@/entities/customers/test/stubs/customer.stub';
import { join } from 'path';
import { Connection } from 'typeorm';
import { Customer } from '@/entities/customers/customer.entity';
import { unlinkSync } from 'fs';
import { writeFile } from '@/utils/writeFile';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    connection = await app.get(Connection);
  });

  afterAll(async () => {
    unlinkSync(join(__dirname, 'tempStorage/sampleCSV.csv'));
    await connection.getRepository(Customer).delete({});
    await app.close();
  });

  describe('Initialize', () => {
    describe('When initialized', () => {
      test('app should be defined', () => {
        expect(app).toBeDefined();
      });
      test('connection should be defined', () => {
        expect(connection).toBeDefined();
      });
    });
  });

  describe('/customers (First)', () => {
    describe('When /customers is called without query params', () => {
      test('then it should return an empty array', async () => {
        const response = await request(app.getHttpServer()).get('/customers');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
      });
    });

    describe('When /customers is called with valid query params', () => {
      test('then it should return an empty array', async () => {
        const response = await request(app.getHttpServer())
          .get('/customers')
          .query({ offset: '0', limit: '10' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
      });
    });

    describe('When /customers is called with invalid query params', () => {
      test('then it should return an error', async () => {
        const response = await request(app.getHttpServer())
          .get('/customers')
          .query({ offset: 'asd', limit: '-100' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: 'Invalid offset or limit',
          error: 'Bad Request',
        });
      });
    });
  });

  describe('/import-customer', () => {
    describe('When/import-customer is called with a dirty file', () => {
      test("then it should return an error message and the details section should contain the incomplete customer's email", async () => {
        writeFile(join(__dirname, 'tempStorage/sampleCSV.csv'), 'dirty');
        const response = await request(app.getHttpServer())
          .post('/import-customer')
          .attach('csv', join(__dirname, 'tempStorage/sampleCSV.csv'));

        expect(response.body.message).toEqual('Some Failures');

        expect(response.body.details[0].failureSource).toContain(
          customerDirtyInputStub().email,
        );
      });
    });

    describe('When /import-customer is called with a clean file', () => {
      test('then it should return a success message', async () => {
        writeFile(join(__dirname, 'tempStorage/sampleCSV.csv'));
        const response = await request(app.getHttpServer())
          .post('/import-customer')
          .attach('csv', join(__dirname, 'tempStorage/sampleCSV.csv'));

        expect(response.body).toEqual({
          message: 'Success',
          code: 201,
          details: [],
        });
      });
    });
  });

  describe('/customers (Second)', () => {
    describe('When /customers is called again', () => {
      test('then it should return an array of one customer, which was in the file', async () => {
        const response = await request(app.getHttpServer()).get('/customers');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([customerOutputStub()]);
      });
    });
  });
});
