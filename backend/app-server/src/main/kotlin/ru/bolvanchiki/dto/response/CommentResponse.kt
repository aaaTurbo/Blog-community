package ru.bolvanchiki.dto.response

import java.time.Instant

data class CommentResponse(
    val id: String,
    val author: String,
    val date: Instant?,
    val text: String
)