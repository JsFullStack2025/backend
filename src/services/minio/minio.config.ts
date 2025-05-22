import { ConfigService } from '@nestjs/config';

const config = new ConfigService();

export const minioConfig = {
    endPoint: config.getOrThrow('S3_HOST'),
    port: +config.getOrThrow('S3_PORT'),
    accessKey: config.getOrThrow('S3_ACCESS_KEY'),
    secretKey: config.getOrThrow('S3_SECRET_KEY'),
    useSSL: false,
}