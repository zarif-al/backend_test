import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { UploadStatus } from '@/utils/interface';
import { CustomerInputDTO } from '@/entities/customers/dto/customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  getAll(offset: number, limit: number): Promise<Customer[]> {
    return this.customersRepository.find({
      where: {
        enabled: true,
      },
      skip: offset,
      take: limit,
    });
  }

  async insertMany(customers: CustomerInputDTO[]): Promise<UploadStatus> {
    try {
      const updatedCustomers = customers.map((customer) =>
        this.customersRepository.create({
          ...customer,
          emailScheduleTime: new Date(customer.emailScheduleTime),
          emailBodyTemplate: `Hi ${customer.name},`,
        }),
      );
      await this.customersRepository.save(updatedCustomers);

      return { success: true, message: [''] };
    } catch (e) {
      return { success: false, message: e.parameters };
    }
  }
}
