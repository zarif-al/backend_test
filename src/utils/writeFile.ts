import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { unparse } from 'papaparse';
import {
  customerInputStub,
  customerDirtyInputStub,
} from '@/entities/customers/test/stubs/customer.stub';

function ensureDirectoryExistence(path) {
  const dir = dirname(path);

  if (existsSync(dir)) {
    return true;
  }

  ensureDirectoryExistence(dir);

  mkdirSync(dir);
}

export function writeFile(
  path: string,
  option: 'clean' | 'dirty' = 'clean',
): void {
  ensureDirectoryExistence(path);
  let csv;
  if (option == 'clean') {
    csv = unparse([customerInputStub()]);
  } else {
    csv = unparse([customerInputStub(), customerDirtyInputStub()]);
  }
  writeFileSync(path, csv);
}
