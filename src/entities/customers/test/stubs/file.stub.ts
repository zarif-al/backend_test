export const sampleFile = (path: string) => {
  return {
    fieldname: 'csv',
    originalname: '1K_Rows.csv',
    encoding: '7bit',
    mimetype: 'text/csv',
    destination: './src/entities/customers/test/tempStorage',
    filename: 'sampleCSV',
    path: path,
    size: 458,
  };
};
