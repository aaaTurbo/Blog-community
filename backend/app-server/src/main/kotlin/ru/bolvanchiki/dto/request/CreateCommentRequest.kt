package ru.bolvanchiki.dto.request

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class CreateCommentRequest(
    @field:NotBlank(message = "Text is required")
    @field:Size(max = 1000, message = "Text must not exceed 1000 characters")
    val text: String
)