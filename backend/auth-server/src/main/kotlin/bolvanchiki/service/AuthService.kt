package bolvanchiki.service

import bolvanchiki.dto.request.LoginRequest
import bolvanchiki.dto.request.RefreshTokenRequest
import bolvanchiki.dto.request.RegisterRequest
import bolvanchiki.dto.request.UpdateUserRequest
import bolvanchiki.dto.response.AuthResponse
import bolvanchiki.dto.response.TokenResponse
import bolvanchiki.dto.response.UserResponse
import bolvanchiki.entity.RefreshToken
import bolvanchiki.entity.User
import bolvanchiki.exception.*
import bolvanchiki.repository.RefreshTokenRepository
import bolvanchiki.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val refreshTokenRepository: RefreshTokenRepository,
    private val jwtTokenService: JwtTokenService,
    private val passwordService: PasswordService
) {

    @Transactional
    fun register(request: RegisterRequest): AuthResponse {
        if (userRepository.existsByEmail(request.email)) {
            throw BadRequestException("Email already exists")
        }

        if (userRepository.existsByUsername(request.username)) {
            throw BadRequestException("Username already exists")
        }

        val user = User(
            username = request.username,
            email = request.email,
            passwordHash = passwordService.hashPassword(request.password)
        )

        val savedUser = userRepository.save(user)

        val tokens = generateTokens(savedUser)

        return AuthResponse(
            user = convertToResponse(savedUser),
            tokens = tokens
        )
    }

    @Transactional
    fun login(request: LoginRequest): AuthResponse {
        val user = userRepository.findByEmail(request.email)
            ?: throw UnauthorizedException("Invalid credentials")

        if (!passwordService.verifyPassword(request.password, user.passwordHash)) {
            throw UnauthorizedException("Invalid credentials")
        }

        val tokens = generateTokens(user)

        return AuthResponse(
            user = convertToResponse(user),
            tokens = tokens
        )
    }

    @Transactional
    fun refreshToken(request: RefreshTokenRequest): TokenResponse {
        val refreshToken = refreshTokenRepository.findByToken(request.refreshToken)
            ?: throw UnauthorizedException("Invalid refresh token")

        if (!refreshToken.isActive) {
            throw UnauthorizedException("Refresh token is expired or revoked")
        }

        val user = refreshToken.user

        refreshToken.revokedAt = LocalDateTime.now()
        refreshTokenRepository.save(refreshToken)

        return generateTokens(user)
    }

    @Transactional
    fun logout(userId: String, refreshToken: String?) {
        if (refreshToken != null) {
            val token = refreshTokenRepository.findByToken(refreshToken)
            token?.let {
                it.revokedAt = LocalDateTime.now()
                refreshTokenRepository.save(it)
            }
        } else {
            refreshTokenRepository.revokeAllUserTokens(userId, LocalDateTime.now())
        }
    }

    @Transactional
    fun updateUser(userId: String, request: UpdateUserRequest): UserResponse {
        val user = userRepository.findById(userId)
            .orElseThrow { NotFoundException("User not found") }

        request.email?.let { email ->
            if (email != user.email && userRepository.existsByEmail(email)) {
                throw BadRequestException("Email already exists")
            }
            user.email = email
        }

        request.newPassword?.let { newPassword ->
            if (request.currentPassword == null) {
                throw BadRequestException("Current password is required to change password")
            }

            if (!passwordService.verifyPassword(request.currentPassword, user.passwordHash)) {
                throw BadRequestException("Current password is incorrect")
            }

            user.passwordHash = passwordService.hashPassword(newPassword)
        }

        val updatedUser = userRepository.save(user)
        return convertToResponse(updatedUser)
    }

    fun getUser(userId: String): UserResponse {
        val user = userRepository.findById(userId)
            .orElseThrow { NotFoundException("User not found") }

        return convertToResponse(user)
    }

    private fun generateTokens(user: User): TokenResponse {
        val accessToken = jwtTokenService.generateAccessToken(user)
        println(accessToken)
        val refreshToken = jwtTokenService.generateRefreshToken()
        println(refreshToken)
        val expiresAt = jwtTokenService.getRefreshTokenExpiration()

        val refreshTokenEntity = RefreshToken(
            token = refreshToken,
            user = user,
            expiresAt = LocalDateTime.ofInstant(expiresAt, java.time.ZoneId.systemDefault())
        )

        refreshTokenRepository.save(refreshTokenEntity)

        return TokenResponse(
            token = accessToken,
            refreshToken = refreshToken,
            expiresIn = jwtTokenService.getRefreshTokenExpiration().epochSecond
        )
    }

    private fun convertToResponse(user: User): UserResponse {
        return UserResponse(
            username = user.username,
            email = user.email
        )
    }
}