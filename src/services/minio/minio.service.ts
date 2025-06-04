import { Injectable } from "@nestjs/common"
import { randomUUID } from "crypto"
import { BucketItem, Client } from "minio"

import { minioConfig } from "./minio.config"

@Injectable()
export class MinioService {
	protected _bucketName = "images"
	private minioClient = new Client(minioConfig)
	constructor() {}

	async bucketsList() {
		return await this.minioClient.listBuckets()
	}

	async listObjects(): Promise<BucketItem[]> {
		const objects: BucketItem[] = []
		const stream = this.minioClient.listObjects(this._bucketName, "", true)

		return new Promise((resolve, reject) => {
			stream.on("data", (item: BucketItem) => {
				objects.push(item)
			})
			stream.on("error", (err) => {
				reject(err)
			})
			stream.on("end", () => {
				resolve(objects)
			})
		})
	}

	async getFile(filename: string) {
		return await this.minioClient.presignedUrl(
			"GET",
			this._bucketName,
			filename
		)
	}

	/**
	 * Uploads a file to MinIO storage
	 * @param file The file to upload from Express.Multer
	 * @returns Promise with upload result containing URL and metadata
	 */
	async uploadFile(file: Express.Multer.File): Promise<{
		url: string
		filename: string
		objInfo: any
	}> {
		const filename = `${randomUUID()}-${file.originalname}`

		try {
			const objInfo = await this.minioClient.putObject(
				this._bucketName,
				filename,
				file.buffer,
				file.size
			)

			return {
				url: `http://${minioConfig.endPoint}:${minioConfig.port}/${this._bucketName}/${filename}`,
				filename,
				objInfo
			}
		} catch (error) {
			throw new Error(`Failed to upload file to MinIO: ${error.message}`)
		}
	}
}
