import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { MinioService } from './minio.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class MinioController {
  constructor(readonly service: MinioService) {}

  @Get('test')
  test(){
    return "Ok";
  }

  @Get('buckets')
  bucketsList() {
    return this.service.bucketsList();
  }

  @Get('file/:name')
  getFile(@Param('name') name: string) {
    return this.service.getFile(name);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile('file') file: Express.Multer.File,
  ) {
    //payload.file = file;
    //console.log(file);
    return this.service.uploadFile(file);
  }
}
