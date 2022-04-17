import { writeFileSync } from 'fs';
import { unparse } from 'papaparse';
import { customerInputStub } from '@/entities/customers/test/stubs/customer.stub';

export function writeFile(path: string) {
  const csv = unparse([customerInputStub()]);
  writeFileSync(path, csv);
}
