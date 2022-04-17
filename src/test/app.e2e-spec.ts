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
    describe('When /customers is called', () => {
      test('then it should return an empty array', async () => {
        const response = await request(app.getHttpServer()).get('/customers');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
      });
    });
  });

  describe('/import-customers', () => {
    describe('When/import-customers is called with a dirty file', () => {
      test("then it should return an error message and the details section should contain the incomplete customer's name and email", async () => {
        writeFile(join(__dirname, 'tempStorage/sampleCSV.csv'), 'dirty');
        const response = await request(app.getHttpServer())
          .post('/import-customers')
          .attach('csv', join(__dirname, 'tempStorage/sampleCSV.csv'));

        expect(response.body.message).toEqual('Some Failures');

        expect(response.body.details[0].failureSource).toContain(
          customerDirtyInputStub().email,
        );

        expect(response.body.details[0].failureSource).toContain(
          customerDirtyInputStub().name,
        );
      });
    });

    describe('When /import-customers is called with a clean file', () => {
      test('then it should return a success message', async () => {
        writeFile(join(__dirname, 'tempStorage/sampleCSV.csv'));
        const response = await request(app.getHttpServer())
          .post('/import-customers')
          .attach('csv', join(__dirname, 'tempStorage/sampleCSV.csv'));

        expect(response.body).toEqual({
          message: 'Success',
          code: 200,
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
