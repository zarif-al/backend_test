import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  findAll(): Promise<Customer[]> {
    return this.customersRepository.find();
  }

  async insertMany(customers: Customer[]): Promise<boolean> {
    try {
      const updatedCustomers = customers.map((customer) =>
        this.customersRepository.create({
          ...customer,
          emailScheduleTime: new Date(customer.emailScheduleTime),
          emailBodyTemplate: `Hi ${customer.name},`,
        }),
      );
      await this.customersRepository.save(updatedCustomers);
      return true;
    } catch (e) {
      return false;
    }
  }

  async remove(id: string): Promise<void> {
    await this.customersRepository.delete(id);
  }
}
