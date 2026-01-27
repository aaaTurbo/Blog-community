package ru.bolvanchiki.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import ru.bolvanchiki.entity.Reaction
import java.util.*

interface ReactionRepository : JpaRepository<Reaction, UUID> {
    fun findByUserUsernameAndPostId(username: String, postId: UUID): Reaction?

    @Query("""
        SELECT COUNT(r) FROM Reaction r 
        WHERE r.post.id = :postId
    """)
    fun countByPostId(@Param("postId") postId: UUID): Long

    fun deleteByUserUsernameAndPostId(username: String, postId: UUID)
}