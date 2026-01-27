package ru.bolvanchiki.controller

import jakarta.validation.Valid
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import ru.bolvanchiki.dto.request.CreatePostRequest
import ru.bolvanchiki.dto.request.PageRequest as PageRequestDto
import ru.bolvanchiki.dto.response.PageResponse
import ru.bolvanchiki.dto.response.PostResponse
import ru.bolvanchiki.entity.User
import ru.bolvanchiki.service.PostService
import ru.bolvanchiki.service.RedisCacheService
import ru.bolvanchiki.service.UserService
import java.util.*

@RestController
@RequestMapping("/posts")
class PostController(
    private val postService: PostService,
    private val redisCacheService: RedisCacheService,
    private val userService: UserService
) {

    @PostMapping
    fun createPost(
        @AuthenticationPrincipal user: User,
        @Valid @ModelAttribute request: CreatePostRequest
    ): ResponseEntity<PostResponse> {
        val post = postService.createPost(user.username, request)
        return ResponseEntity(postService.convertToResponseWithReaction(post), HttpStatus.CREATED)
    }

    @DeleteMapping("/{postId}")
    fun deletePost(
        @AuthenticationPrincipal user: User,
        @PathVariable postId: String
    ): ResponseEntity<Void> {
        postService.deletePost(user.username, UUID.fromString(postId))
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build()
    }

    @GetMapping("/user/{username}")
    fun getUserPosts(
        @PathVariable username: String,
        @Valid @ModelAttribute pageRequest: PageRequestDto,
        @AuthenticationPrincipal user: User?
    ): ResponseEntity<PageResponse<PostResponse>> {
        val postsPage = postService.getUserPosts(
            username,
            pageRequest.page,
            pageRequest.size,
            user?.username
        )

        val postsResponse = postsPage.content.map {
            postService.convertToResponseWithReaction(it)
        }

        val response = PageResponse(
            content = postsResponse,
            page = postsPage.number,
            size = postsPage.size,
            totalElements = postsPage.totalElements,
            totalPages = postsPage.totalPages,
            last = postsPage.isLast
        )

        return ResponseEntity.ok(response)
    }

    @GetMapping("/feed")
    fun getNewsFeed(
        @AuthenticationPrincipal user: User,
        @Valid @ModelAttribute pageRequest: PageRequestDto
    ): ResponseEntity<PageResponse<PostResponse>> {
        val cachedPosts = if (pageRequest.page == 0) {
            redisCacheService.getCachedFeed(user.username, pageRequest.page, pageRequest.size)
        } else emptyList()

        val posts = if (cachedPosts.isNotEmpty()) {
            cachedPosts
        } else {
            val followedUsernames = userService.getFollowedUsers(user.username).map { it.username }

            if (followedUsernames.isEmpty()) {
                emptyList()
            } else {
                val pageable = PageRequest.of(
                    pageRequest.page,
                    pageRequest.size,
                    Sort.by(Sort.Direction.DESC, "createdAt")
                )
                val postsPage = postService.getPostsByUsernames(followedUsernames, pageable)
                postsPage.content.map { postService.convertToResponseWithReaction(it) }
            }
        }

        val response = PageResponse(
            content = posts,
            page = pageRequest.page,
            size = pageRequest.size,
            totalElements = -1,
            totalPages = -1,
            last = posts.size < pageRequest.size
        )

        return ResponseEntity.ok(response)
    }

    @GetMapping("/{postId}")
    fun getPostDetail(
        @PathVariable postId: String,
        @AuthenticationPrincipal user: User?
    ): ResponseEntity<PostResponse> {
        val cachedPost = redisCacheService.getCachedPost(UUID.fromString(postId))

        val postResponse = if (cachedPost != null) {
            cachedPost.copy(hasReacted = user?.let {
                postService.hasUserReacted(it.username, UUID.fromString(postId))
            } ?: false)
        } else {
            val post = postService.getPostById(UUID.fromString(postId))
            postService.convertToResponseWithReaction(post)
        }

        return ResponseEntity.ok(postResponse)
    }
}