package ru.bolvanchiki.dto.request

import jakarta.validation.constraints.Size

data class UpdatePostRequest(
    @field:Size(max = 2000, message = "Text must not exceed 2000 characters")
    val text: String? = null,

    val deleteImage: Boolean = false
)