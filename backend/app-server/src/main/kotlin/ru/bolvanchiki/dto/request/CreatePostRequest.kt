package ru.bolvanchiki.dto.request

import jakarta.validation.constraints.Size
import org.springframework.web.multipart.MultipartFile

data class CreatePostRequest(
    @field:Size(max = 2000, message = "Text must not exceed 2000 characters")
    val text: String? = null,

    val image: MultipartFile? = null
)