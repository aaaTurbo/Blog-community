package ru.bolvanchiki.repository

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import ru.bolvanchiki.entity.Comment
import java.util.*

interface CommentRepository : JpaRepository<Comment, UUID> {
    fun findByPostIdOrderByCreatedAtDesc(postId: UUID, pageable: Pageable): Page<Comment>
}