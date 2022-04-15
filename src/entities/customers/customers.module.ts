import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { Customer } from './customer.entity';
import { MulterModule } from '@nestjs/platform-express';
@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './tempStorage',
      }),
    }),
    TypeOrmModule.forFeature([Customer]),
  ],
  providers: [CustomersService],
  controllers: [CustomersController],
})
export class CustomersModule {}
