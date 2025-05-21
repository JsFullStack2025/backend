import { ConfigService } from '@nestjs/config';

export const minioConfig = {
    endPoint: process.env.S3_HOST ?? 'localhost',
          port: process.env.S3_PORT ? +process.env.S3_PORT : 9000,
          accessKey: process.env.S3_ACCESS_KEY,
          secretKey: process.env.S3_SECRET_KEY,
          useSSL: false,
}