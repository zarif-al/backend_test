import { writeFileSync } from 'fs';
import { unparse } from 'papaparse';
import { join } from 'path';
import { customerInputStub } from '@/entities/customers/test/stubs/customer.stub';

export function writeFile() {
  const csv = unparse([customerInputStub()]);
  writeFileSync(join(__dirname, 'tempStorage/sampleCSV.csv'), csv);
}
