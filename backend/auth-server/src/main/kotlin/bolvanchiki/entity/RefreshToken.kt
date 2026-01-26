package bolvanchiki.entity

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "refresh_tokens")
data class RefreshToken(
    @Id
    val id: UUID = UUID.randomUUID(),

    @Column(nullable = false, unique = true)
    val token: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "username", nullable = false)
    val user: User,

    @Column(name = "expires_at", nullable = false)
    val expiresAt: LocalDateTime,

    @Column(name = "created_at", nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "revoked_at")
    var revokedAt: LocalDateTime? = null
) {
    val isExpired: Boolean
        get() = LocalDateTime.now().isAfter(expiresAt)

    val isActive: Boolean
        get() = revokedAt == null && !isExpired
}