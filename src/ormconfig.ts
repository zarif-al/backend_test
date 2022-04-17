import { ConnectionOptions } from 'typeorm';
import { Customer } from '@/entities/customers/customer.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionOptions: ConnectionOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_USER_PASS,
  database:
    process.env.TESTING === 'true'
      ? process.env.MYSQL_TEST_DATABASE_NAME
      : process.env.MYSQL_DATABASE_NAME,
  entities: [Customer],
  debug: false,
  synchronize: false,
  migrations: ['dist/migrations/*.js'],
  cli: {
    migrationsDir: 'migrations',
  },
};

export = connectionOptions;
