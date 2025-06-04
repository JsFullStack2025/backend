import {
	Controller,
	Get,
	Param,
	Post,
	UploadedFile,
	UseInterceptors
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"

import { MinioService } from "./minio.service"

@Controller("files")
export class MinioController {
	constructor(readonly service: MinioService) {}

	@Get("buckets")
	bucketsList() {
		return this.service.bucketsList()
	}

	@Get("objects")
	getObjects() {
		return this.service.listObjects()
	}

	@Get("file/:name")
	getFile(@Param("name") name: string) {
		return this.service.getFile(name)
	}

	@Post("upload")
	@UseInterceptors(FileInterceptor("file"))
	uploadFile(@UploadedFile("file") file: Express.Multer.File) {
		return this.service.uploadFile(file)
	}
}
