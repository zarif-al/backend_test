import { Customer } from '@/entities/customers/customer.entity';

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
