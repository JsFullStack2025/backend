import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BucketItem, Client } from 'minio';
import { minioConfig} from './minio.config'

@Injectable()
export class MinioService {
  protected _bucketName = 'images';
  private minioClient = new Client(minioConfig);
  constructor() {}

  async bucketsList() {
    return await this.minioClient.listBuckets();
  }

  async listObjects(): Promise<BucketItem[]> {
    const objects: BucketItem[] = [];
    const stream = this.minioClient.listObjects(this._bucketName, '', true);

    return new Promise((resolve, reject) => {
        stream.on('data', (item: BucketItem) => {
            objects.push(item);
        });
        stream.on('error', (err) => {
            reject(err);
        });
        stream.on('end', () => {
            resolve(objects);
        });
    });
}

  async getFile(filename: string) {
    return await this.minioClient.presignedUrl(
      'GET',
      this._bucketName,
      filename,
    );
  }

  uploadFile(file: Express.Multer.File) {
    return new Promise((resolve, reject) => {
      const filename = `${randomUUID().toString()}-${file.originalname}`;
      this.minioClient.putObject(
        this._bucketName,
        filename,
        file.buffer,
        file.size,
        (error, objInfo) => {
          if (error) {
            reject(error);
          } else {
            const result = {
              url: 'http://'+minioConfig.endPoint+':'+minioConfig.port+'/'+this._bucketName+'/'+filename,
              filename: filename,
              objInfo: objInfo
            }
            resolve(result);
          }
        },
      );
    });
  }
}
