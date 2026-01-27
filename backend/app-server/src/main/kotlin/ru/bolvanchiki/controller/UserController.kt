package ru.bolvanchiki.controller

import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import ru.bolvanchiki.entity.User as UserEntity
import ru.bolvanchiki.service.FollowService
import ru.bolvanchiki.service.UserService

@RestController
@RequestMapping("/users")
class UserController(
    private val userService: UserService,
    private val followService: FollowService
) {

    @GetMapping("/me")
    fun getCurrentUser(@AuthenticationPrincipal user: UserEntity): ResponseEntity<Any> {
        val userResponse = userService.convertToResponse(user, followService, user.username)
        return ResponseEntity.ok(userResponse)
    }

    @GetMapping("/{username}")
    fun getUser(
        @PathVariable username: String,
        @AuthenticationPrincipal user: UserEntity?
    ): ResponseEntity<Any> {
        val userEntity = userService.getByUsername(username)
        val userResponse = userService.convertToResponse(userEntity, followService, user?.username)
        return ResponseEntity.ok(userResponse)
    }
}