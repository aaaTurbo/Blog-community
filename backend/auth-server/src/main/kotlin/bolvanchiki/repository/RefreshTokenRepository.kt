package bolvanchiki.repository

import bolvanchiki.entity.RefreshToken
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.time.LocalDateTime
import java.util.*

@Repository
interface RefreshTokenRepository : JpaRepository<RefreshToken, UUID> {
    fun findByToken(token: String): RefreshToken?

    @Query("SELECT rt FROM RefreshToken rt WHERE rt.user.username = :userId AND rt.revokedAt IS NULL AND rt.expiresAt > :now")
    fun findActiveTokensByUser(@Param("userId") userId: String, @Param("now") now: LocalDateTime): List<RefreshToken>

    @Modifying
    @Query("UPDATE RefreshToken rt SET rt.revokedAt = :revokedAt WHERE rt.user.username = :userId AND rt.revokedAt IS NULL")
    fun revokeAllUserTokens(@Param("userId") userId: String, @Param("revokedAt") revokedAt: LocalDateTime): Int
}