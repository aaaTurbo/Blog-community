package bolvanchiki.dto.response

data class TokenResponse(
    val token: String,
    val refreshToken: String,
    val tokenType: String = "Bearer",
    val expiresIn: Long
)