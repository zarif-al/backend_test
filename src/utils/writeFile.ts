import { writeFileSync } from 'fs';
import { unparse } from 'papaparse';
import {
  customerInputStub,
  customerDirtyInputStub,
} from '@/entities/customers/test/stubs/customer.stub';

export function writeFile(
  path: string,
  option: 'clean' | 'dirty' = 'clean',
): void {
  let csv;
  if (option == 'clean') {
    csv = unparse([customerInputStub()]);
  } else {
    csv = unparse([customerInputStub(), customerDirtyInputStub()]);
  }
  writeFileSync(path, csv);
}
