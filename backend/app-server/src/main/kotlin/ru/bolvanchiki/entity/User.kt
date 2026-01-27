package ru.bolvanchiki.entity

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "users")
data class User(
    @Id
    val username: String,

    @Column(name = "external_id", unique = true, nullable = false)
    val externalId: String

) {
    @OneToMany(mappedBy = "author", fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
    val posts: List<Post> = emptyList()

    @OneToMany(mappedBy = "follower", fetch = FetchType.LAZY)
    val following: List<UserFollow> = emptyList()

    @OneToMany(mappedBy = "followed", fetch = FetchType.LAZY)
    val followers: List<UserFollow> = emptyList()

    @OneToMany(mappedBy = "author", fetch = FetchType.LAZY)
    val comments: List<Comment> = emptyList()

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    val reactions: List<Reaction> = emptyList()
}