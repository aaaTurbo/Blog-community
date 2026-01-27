package ru.bolvanchiki.dto.response

import java.time.Instant

data class PostResponse(
    val id: String,
    val img: String?,
    val text: String?,
    val author: String,
    val date: Instant?,
    val reactions: Long,
    val comments: Long,
    val hasReacted: Boolean = false
)