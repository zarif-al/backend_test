import { ConnectionOptions } from 'typeorm';
import { User } from '@/entities/users/user.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionOptions: ConnectionOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_USER_PASS,
  database: process.env.MYSQL_DATABASE_NAME,
  entities: [User],
  debug: false,
  synchronize: false,
  migrations: ['dist/migrations/*.js'],
  cli: {
    migrationsDir: 'migrations',
  },
};

export = connectionOptions;
