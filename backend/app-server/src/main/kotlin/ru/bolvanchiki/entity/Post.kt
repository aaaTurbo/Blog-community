package ru.bolvanchiki.entity

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "posts", indexes = [
    Index(name = "idx_post_author_created", columnList = "author_username, created_at DESC"),
    Index(name = "idx_post_created", columnList = "created_at DESC")
])
data class Post(
    @Id
    val id: UUID = UUID.randomUUID(),

    @Column(columnDefinition = "TEXT")
    val text: String? = null,

    @Column(name = "image_key")
    val imageKey: String? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_username", nullable = false)
    val author: User,

    @Column(name = "created_at", nullable = false)
    val createdAt: Date = Date(),

    @Column(name = "is_deleted", nullable = false)
    val isDeleted: Boolean = false
) {
    @OneToMany(mappedBy = "post", fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
    val comments: List<Comment> = emptyList()

    @OneToMany(mappedBy = "post", fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
    val reactions: List<Reaction> = emptyList()

    fun getReactionsCount(): Long = reactions.size.toLong()
    fun getCommentsCount(): Long = comments.size.toLong()
}