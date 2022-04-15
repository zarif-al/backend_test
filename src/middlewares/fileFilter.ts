import { BadRequestException } from '@nestjs/common';

export const FileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(csv)$/)) {
    return callback(
      new BadRequestException('Only CSV files are allowed!'),
      false,
    );
  }
  callback(null, true);
};
