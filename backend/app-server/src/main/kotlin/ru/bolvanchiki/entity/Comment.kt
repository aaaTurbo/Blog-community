package ru.bolvanchiki.entity

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "comments")
data class Comment(
    @Id
    val id: UUID = UUID.randomUUID(),

    @Column(columnDefinition = "TEXT", nullable = false)
    val text: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_username", nullable = false)
    val author: User,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    val post: Post,

    @Column(name = "created_at", nullable = false)
    val createdAt: Date = Date()
)