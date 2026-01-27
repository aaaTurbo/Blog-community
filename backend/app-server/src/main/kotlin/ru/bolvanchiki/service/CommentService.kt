package ru.bolvanchiki.service

import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import ru.bolvanchiki.dto.request.CreateCommentRequest
import ru.bolvanchiki.dto.response.CommentResponse
import ru.bolvanchiki.entity.Comment
import ru.bolvanchiki.exception.NotFoundException
import ru.bolvanchiki.repository.CommentRepository
import java.util.*

@Service
class CommentService(
    private val commentRepository: CommentRepository,
    private val userService: UserService,
    private val postService: PostService
) {

    @Transactional
    fun createComment(
        username: String,
        postId: UUID,
        request: CreateCommentRequest
    ): Comment {
        val user = userService.getByUsername(username)
        val post = postService.getPostById(postId)

        val comment = Comment(
            text = request.text,
            author = user,
            post = post
        )

        return commentRepository.save(comment)
    }

    @Transactional
    fun deleteComment(username: String, commentId: UUID) {
        val comment = commentRepository.findById(commentId)
            .orElseThrow { NotFoundException("Comment not found") }

        if (comment.author.username != username) {
            throw NotFoundException("You can only delete your own comments")
        }

        commentRepository.delete(comment)
    }

    fun getCommentsByPost(
        postId: UUID,
        page: Int,
        size: Int
    ): Page<Comment> {
        val pageable: Pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))
        return commentRepository.findByPostIdOrderByCreatedAtDesc(postId, pageable)
    }

    fun convertToResponse(comment: Comment): CommentResponse {
        return CommentResponse(
            id = comment.id.toString(),
            author = comment.author.username,
            date = comment.createdAt.toInstant(),
            text = comment.text
        )
    }
}