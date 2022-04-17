import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import {
  customerInputStub,
  customerOutputStub,
} from '@/entities/customers/test/stubs/customer.stub';
import { writeFileSync } from 'fs';
import { unparse } from 'papaparse';
import { join } from 'path';
import { Connection } from 'typeorm';
import { Customer } from '@/entities/customers/customer.entity';

function writeFile() {
  const csv = unparse([customerInputStub()]);
  writeFileSync(join(__dirname, 'tempStorage/sampleCSV.csv'), csv);
}

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    connection = app.get(Connection);
  });

  afterAll(async () => {
    connection.getRepository(Customer).delete({});
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
    describe('When /import-customers is called with a file', () => {
      test('then it should return a success message', async () => {
        writeFile();
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
