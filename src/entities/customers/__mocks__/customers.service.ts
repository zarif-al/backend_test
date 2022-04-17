import { customerStubs } from '@/entities/customers/test/stubs/customer.stub';

export const CustomersService = jest.fn().mockReturnValue({
  getAll: jest.fn().mockResolvedValue(customerStubs()),
  insertMany: jest.fn().mockResolvedValue({ success: true, message: [] }),
});
