import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';
import {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  UploadFolder,
} from 'src/constants/upload.constants';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  private readonly allowedTypes = ALLOWED_FILE_TYPES;
  private readonly maxSize = MAX_FILE_SIZE;

  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    if (!value) {
      return undefined;
    }

    if (!this.allowedTypes.includes(value.mimetype)) {
      throw new BadRequestException(
        'Only accept image files (jpeg, jpg, png, gif)',
      );
    }

    if (value.size > this.maxSize) {
      throw new BadRequestException(
        `File size exceeded ${this.maxSize / (1024 * 1024)}MB`,
      );
    }

    return value;
  }
}
