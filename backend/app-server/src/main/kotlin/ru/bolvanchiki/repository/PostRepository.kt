package ru.bolvanchiki.repository

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import ru.bolvanchiki.entity.Post
import java.util.*

interface PostRepository : JpaRepository<Post, UUID> {
    fun findByAuthorUsernameAndIsDeletedFalseOrderByCreatedAtDesc(
        username: String,
        pageable: Pageable
    ): Page<Post>

    fun findByAuthorUsernameAndCreatedAtBeforeAndIsDeletedFalseOrderByCreatedAtDesc(
        username: String,
        createdAt: Date,
        pageable: Pageable
    ): Page<Post>

    @Query("""
        SELECT p FROM Post p 
        WHERE p.author.username IN :usernames 
        AND p.isDeleted = false 
        ORDER BY p.createdAt DESC
    """)
    fun findPostsByAuthors(
        @Param("usernames") usernames: List<String>,
        pageable: Pageable
    ): Page<Post>

    @Query("""
        SELECT p FROM Post p 
        WHERE p.author.username IN :usernames 
        AND p.createdAt < :createdAt 
        AND p.isDeleted = false 
        ORDER BY p.createdAt DESC
    """)
    fun findPostsByAuthorsBefore(
        @Param("usernames") usernames: List<String>,
        @Param("createdAt") createdAt: Date,
        pageable: Pageable
    ): Page<Post>
}