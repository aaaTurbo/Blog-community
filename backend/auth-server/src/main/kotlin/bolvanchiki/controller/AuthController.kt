package bolvanchiki.controller

import bolvanchiki.dto.request.LoginRequest
import bolvanchiki.dto.request.RefreshTokenRequest
import bolvanchiki.dto.request.RegisterRequest
import bolvanchiki.dto.request.UpdateUserRequest
import bolvanchiki.security.JwtAuthFilter
import bolvanchiki.service.AuthService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/")
class AuthController(
    private val authService: AuthService
) {

    @PostMapping("/register")
    fun register(@Valid @RequestBody request: RegisterRequest): ResponseEntity<Any> {
        val response = authService.register(request)
        return ResponseEntity(response, HttpStatus.CREATED)
    }

    @PostMapping("/login")
    fun login(@Valid @RequestBody request: LoginRequest): ResponseEntity<Any> {
        val response = authService.login(request)
        return ResponseEntity.ok(response)
    }

    @PostMapping("/refresh")
    fun refresh(@Valid @RequestBody request: RefreshTokenRequest): ResponseEntity<Any> {
        val response = authService.refreshToken(request)
        return ResponseEntity.ok(response)
    }

    @PostMapping("/logout")
    fun logout(
        @AuthenticationPrincipal user: JwtAuthFilter.UserPrincipal,
        @RequestBody(required = false) request: Map<String, String>?
    ): ResponseEntity<Void> {
        val refreshToken = request?.get("refreshToken")
        authService.logout(user.id, refreshToken)
        return ResponseEntity.status(HttpStatus.OK).build()
    }

    @GetMapping("/me")
    fun getCurrentUser(
        @AuthenticationPrincipal user: JwtAuthFilter.UserPrincipal
    ): ResponseEntity<Any> {
        val userResponse = authService.getUser(user.id)
        return ResponseEntity.ok(userResponse)
    }

    @PutMapping("/me")
    fun updateUser(
        @AuthenticationPrincipal user: JwtAuthFilter.UserPrincipal,
        @Valid @RequestBody request: UpdateUserRequest
    ): ResponseEntity<Any> {
        val userResponse = authService.updateUser(user.id, request)
        return ResponseEntity.ok(userResponse)
    }

    @GetMapping("/users/{username}")
    fun getUserByUsername(@PathVariable username: String): ResponseEntity<Any> {
        val userResponse = authService.getUser(username)
        return ResponseEntity.ok(userResponse)
    }
}