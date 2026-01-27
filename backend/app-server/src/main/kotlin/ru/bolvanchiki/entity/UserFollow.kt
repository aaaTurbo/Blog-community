package ru.bolvanchiki.entity

import jakarta.persistence.*
import java.util.*

@Entity
@Table(
    name = "user_follows",
    uniqueConstraints = [
        UniqueConstraint(columnNames = ["follower_username", "followed_username"])
    ]
)
data class UserFollow(
    @Id
    val id: UUID = UUID.randomUUID(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "follower_username", nullable = false)
    val follower: User,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "followed_username", nullable = false)
    val followed: User,

    @Column(name = "created_at", nullable = false)
    val createdAt: Date = Date()
)