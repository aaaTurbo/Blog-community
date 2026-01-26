package bolvanchiki.dto.request

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.Size

data class UpdateUserRequest(
    @field:Email(message = "Invalid email format")
    val email: String? = null,

    val currentPassword: String? = null,

    @field:Size(min = 8, message = "Password must be at least 8 characters")
    val newPassword: String? = null
)