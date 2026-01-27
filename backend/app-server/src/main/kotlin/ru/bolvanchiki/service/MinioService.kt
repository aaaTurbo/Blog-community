package ru.bolvanchiki.service

import io.minio.BucketExistsArgs
import io.minio.MakeBucketArgs
import io.minio.MinioClient
import io.minio.PutObjectArgs
import io.minio.RemoveObjectArgs
import io.minio.SetBucketPolicyArgs
import jakarta.annotation.PostConstruct
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.util.*
import kotlin.math.log

@Service
class MinioService(
    private val minioClient: MinioClient
) {

    @Value("\${app.minio.bucket-name}")
    private lateinit var bucketName: String

    @Value("\${app.minio.endpoint}")
    private lateinit var endpoint: String

    @Value("\${app.minio.public-access:false}")
    private val publicAccess: Boolean = false

    @PostConstruct
    fun init() {
        createBucketIfNotExists()
        if (publicAccess) {
            setPublicReadAccess()
        }
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

    private fun setPublicReadAccess() {
        try {
            val policyJson = """
            {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": "*",
                        "Action": [
                            "s3:GetObject"
                        ],
                        "Resource": [
                            "arn:aws:s3:::${bucketName}/*"
                        ]
                    }
                ]
            }
            """.trimIndent()

            minioClient.setBucketPolicy(
                SetBucketPolicyArgs.builder()
                    .bucket(bucketName)
                    .config(policyJson)
                    .build()
            )

            println("✅ Public read access enabled for bucket: $bucketName")
        } catch (e: Exception) {
            println("⚠️ Could not set public access policy: ${e.message}")
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
        return "storage/$imageKey"
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