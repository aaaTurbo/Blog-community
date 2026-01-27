package ru.bolvanchiki.dto.response

import java.time.Instant

data class UserResponse(
    val id: String,
    val username: String,
    val isFollowing: Boolean = false,
    val followersCount: Long = 0,
    val followingCount: Long = 0
)