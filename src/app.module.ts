import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from '@/entities/customers/customers.module';
import * as connectionOptions from '@/ormconfig';

const modules = [CustomersModule];

@Module({
  imports: [TypeOrmModule.forRoot(connectionOptions), ...modules],
  controllers: [],
  providers: [],
})
export class AppModule {}
