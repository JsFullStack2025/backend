import { ConfigService } from "@nestjs/config"

const config = new ConfigService()

export const minioConfig = {
	endPoint: config.getOrThrow<string>("S3_HOST"),
	port: config.getOrThrow<number>("S3_PORT"),
	accessKey: config.getOrThrow<string>("S3_ACCESS_KEY"),
	secretKey: config.getOrThrow<string>("S3_SECRET_KEY"),
	useSSL: false
}
