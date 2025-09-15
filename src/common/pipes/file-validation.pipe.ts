import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  private readonly allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
  ];
  private readonly maxSize = 5 * 1024 * 1024;

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
