package ru.bolvanchiki.controller

import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import ru.bolvanchiki.entity.User
import ru.bolvanchiki.service.ReactionService
import java.util.*

@RestController
@RequestMapping("/reactions")
class ReactionController(
    private val reactionService: ReactionService
) {

    @PostMapping("/{postId}")
    fun toggleReaction(
        @AuthenticationPrincipal user: User,
        @PathVariable postId: String
    ): ResponseEntity<Map<String, Any>> {
        val reacted = reactionService.toggleReaction(user.username, UUID.fromString(postId))
        val count = reactionService.getReactionCount(UUID.fromString(postId))

        return ResponseEntity.ok(mapOf(
            "reacted" to reacted,
            "count" to count
        ))
    }

    @GetMapping("/{postId}/check")
    fun checkReaction(
        @AuthenticationPrincipal user: User,
        @PathVariable postId: String
    ): ResponseEntity<Map<String, Any>> {
        val hasReacted = reactionService.hasUserReacted(user.username, UUID.fromString(postId))
        val count = reactionService.getReactionCount(UUID.fromString(postId))

        return ResponseEntity.ok(mapOf(
            "hasReacted" to hasReacted,
            "count" to count
        ))
    }
}