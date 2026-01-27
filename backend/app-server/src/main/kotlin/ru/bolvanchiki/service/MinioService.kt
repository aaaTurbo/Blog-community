package ru.bolvanchiki.service

import io.minio.BucketExistsArgs
import io.minio.MakeBucketArgs
import io.minio.MinioClient
import io.minio.PutObjectArgs
import io.minio.RemoveObjectArgs
import jakarta.annotation.PostConstruct
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.util.*

@Service
class MinioService(
    private val minioClient: MinioClient
) {

    @Value("\${app.minio.bucket-name}")
    private lateinit var bucketName: String

    @Value("\${app.minio.endpoint}")
    private lateinit var endpoint: String

    @PostConstruct
    fun init() {
        createBucketIfNotExists()
    }

    private fun createBucketIfNotExists() {
        try {
            val bucketExists = minioClient.bucketExists(
                BucketExistsArgs.builder()
                    .bucket(bucketName)
                    .build()
            )

            if (!bucketExists) {
                minioClient.makeBucket(
                    MakeBucketArgs.builder()
                        .bucket(bucketName)
                        .build()
                )
            }
        } catch (e: Exception) {
            throw RuntimeException("Failed to create MinIO bucket", e)
        }
    }

    fun uploadImage(userId: String, file: MultipartFile): String {
        validateImage(file)

        val originalFilename = file.originalFilename ?: "image"
        val extension = originalFilename.substringAfterLast('.', "")
        val filename = "${UUID.randomUUID()}.${if (extension.isNotEmpty()) extension else "jpg"}"
        val objectKey = "posts/${userId}/$filename"

        try {
            minioClient.putObject(
                PutObjectArgs.builder()
                    .bucket(bucketName)
                    .`object`(objectKey)
                    .stream(file.inputStream, file.size, -1)
                    .contentType(file.contentType)
                    .build()
            )

            return objectKey
        } catch (e: Exception) {
            throw RuntimeException("Failed to upload image to MinIO", e)
        }
    }

    fun deleteImage(imageKey: String) {
        try {
            minioClient.removeObject(
                RemoveObjectArgs.builder()
                    .bucket(bucketName)
                    .`object`(imageKey)
                    .build()
            )
        } catch (e: Exception) {
            throw RuntimeException("Failed to delete image from MinIO", e)
        }
    }

    fun getImageUrl(imageKey: String): String {
        return "$endpoint/$bucketName/$imageKey"
    }

    private fun validateImage(file: MultipartFile) {
        if (file.isEmpty) {
            throw IllegalArgumentException("Image file is empty")
        }

        val allowedTypes = listOf("image/jpeg", "image/png", "image/gif", "image/webp")
        if (!allowedTypes.contains(file.contentType)) {
            throw IllegalArgumentException("Invalid image type. Allowed types: JPEG, PNG, GIF, WEBP")
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB
            throw IllegalArgumentException("Image size must not exceed 10MB")
        }
    }
}