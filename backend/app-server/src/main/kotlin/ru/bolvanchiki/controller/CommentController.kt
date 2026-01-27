package ru.bolvanchiki.controller

import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import ru.bolvanchiki.dto.request.CreateCommentRequest
import ru.bolvanchiki.dto.response.CommentResponse
import ru.bolvanchiki.dto.response.PageResponse
import ru.bolvanchiki.entity.User
import ru.bolvanchiki.service.CommentService
import java.util.*

@RestController
@RequestMapping("/comments")
class CommentController(
    private val commentService: CommentService
) {

    @PostMapping("/{postId}")
    fun createComment(
        @AuthenticationPrincipal user: User,
        @PathVariable postId: String,
        @Valid @RequestBody request: CreateCommentRequest
    ): ResponseEntity<CommentResponse> {
        val comment = commentService.createComment(user.username, UUID.fromString(postId), request)
        return ResponseEntity(commentService.convertToResponse(comment), HttpStatus.CREATED)
    }

    @DeleteMapping("/{commentId}")
    fun deleteComment(
        @AuthenticationPrincipal user: User,
        @PathVariable commentId: String
    ): ResponseEntity<Void> {
        commentService.deleteComment(user.username, UUID.fromString(commentId))
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build()
    }

    @GetMapping("/{postId}")
    fun getCommentsByPost(
        @PathVariable postId: String,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int
    ): ResponseEntity<PageResponse<CommentResponse>> {
        val commentsPage = commentService.getCommentsByPost(UUID.fromString(postId), page, size)

        val commentsResponse = commentsPage.content.map { commentService.convertToResponse(it) }

        val response = PageResponse(
            content = commentsResponse,
            page = commentsPage.number,
            size = commentsPage.size,
            totalElements = commentsPage.totalElements,
            totalPages = commentsPage.totalPages,
            last = commentsPage.isLast
        )

        return ResponseEntity.ok(response)
    }
}