package ru.bolvanchiki.controller

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import ru.bolvanchiki.entity.User
import ru.bolvanchiki.service.FollowService

@RestController
@RequestMapping("/follow")
class FollowController(
    private val followService: FollowService
) {

    @PostMapping("/{username}")
    fun followUser(
        @AuthenticationPrincipal user: User,
        @PathVariable username: String
    ): ResponseEntity<Void> {
        followService.followUser(user.username, username)
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build()
    }

    @DeleteMapping("/{username}")
    fun unfollowUser(
        @AuthenticationPrincipal user: User,
        @PathVariable username: String
    ): ResponseEntity<Void> {
        followService.unfollowUser(user.username, username)
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build()
    }

    @GetMapping("/{username}/check")
    fun checkFollowing(
        @AuthenticationPrincipal user: User,
        @PathVariable username: String
    ): ResponseEntity<Map<String, Boolean>> {
        val isFollowing = followService.isFollowing(user.username, username)
        return ResponseEntity.ok(mapOf("isFollowing" to isFollowing))
    }
}