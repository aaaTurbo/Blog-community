package ru.bolvanchiki.entity

import jakarta.persistence.*
import java.util.*

@Entity
@Table(
    name = "reactions",
    uniqueConstraints = [
        UniqueConstraint(columnNames = ["user_username", "post_id"])
    ]
)
data class Reaction(
    @Id
    val id: UUID = UUID.randomUUID(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_username", nullable = false)
    val user: User,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    val post: Post,

    @Column(name = "created_at", nullable = false)
    val createdAt: Date = Date()
)