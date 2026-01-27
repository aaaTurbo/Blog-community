package ru.bolvanchiki.config

import io.minio.MinioClient
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class MinioConfig {

    @Value("\${app.minio.endpoint}")
    private lateinit var endpoint: String

    @Value("\${app.minio.access-key}")
    private lateinit var accessKey: String

    @Value("\${app.minio.secret-key}")
    private lateinit var secretKey: String

    @Value("\${app.minio.secure:false}")
    private val secure: Boolean = false

    @Bean
    fun minioClient(): MinioClient {
        return MinioClient.builder()
            .endpoint(endpoint)
            .credentials(accessKey, secretKey)
            .build()
    }
}