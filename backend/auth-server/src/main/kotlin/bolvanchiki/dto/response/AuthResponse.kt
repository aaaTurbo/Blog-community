package bolvanchiki.dto.response

data class AuthResponse(
    val user: UserResponse,
    val tokens: TokenResponse
)