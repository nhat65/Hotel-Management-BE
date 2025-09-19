import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MAX_FILE_SIZE } from 'src/constants/upload.constants';

export function UploadImageInterceptor(
  fieldName: string,
  folderPath: string = 'common',
) {
  return FileInterceptor(fieldName, {
    storage: diskStorage({
      destination: (req, file, callback) => {
        const dynamicPath = `./public/uploads/${folderPath}/`;

        const fs = require('fs');
        if (!fs.existsSync(dynamicPath)) {
          fs.mkdirSync(dynamicPath, { recursive: true });
        }

        callback(null, dynamicPath);
      },
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${fieldName}-${uniqueSuffix}${ext}`);
      },
    }),
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.match(/^image\//)) {
        return callback(new Error('This is not image file!'), false);
      }
      callback(null, true);
    },
  });
}
