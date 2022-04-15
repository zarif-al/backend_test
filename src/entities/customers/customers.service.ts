import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { UploadStatus } from '@/utils/interface';
@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  findAll(): Promise<Customer[]> {
    return this.customersRepository.find();
  }

  async insertMany(customers: Customer[]): Promise<UploadStatus> {
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

  async remove(id: string): Promise<void> {
    await this.customersRepository.delete(id);
  }
}
