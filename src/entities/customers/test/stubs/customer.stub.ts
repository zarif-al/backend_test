import { Customer } from '@/entities/customers/customer.entity';
import { CustomerDTO } from '@/entities/customers/dto/customer.dto';

export const customerStubs = (): Customer[] => {
  const customers = Array.from({ length: 10 }, () => {
    return {
      name: 'Jason Bourne',
      email: 'borne@brn.com',
      address: '123 Main St',
      enabled: true,
      emailScheduleTime: new Date('5/13/2021  9:33:28 PM'),
      emailBodyTemplate: 'Hi Jason Bourne,',
    };
  });

  return customers;
};

export const customerInputStub = (): CustomerDTO => {
  return {
    name: 'John Doe',
    email: 'doe@john.com',
    address: '123 Main St',
    enabled: true,
    emailScheduleTime: '5/13/2021  9:33:28 PM',
  };
};

export const customerStub = (): Customer => {
  return {
    name: 'John Doe',
    email: 'doe@john.com',
    address: '123 Main St',
    enabled: true,
    emailScheduleTime: new Date('5/13/2021  9:33:28 PM'),
    emailBodyTemplate: 'Hi John Doe,',
  };
};
