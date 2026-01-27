package ru.bolvanchiki.service

import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import ru.bolvanchiki.dto.request.CreatePostRequest
import ru.bolvanchiki.dto.response.PostResponse
import ru.bolvanchiki.entity.Post
import ru.bolvanchiki.exception.BadRequestException
import ru.bolvanchiki.exception.NotFoundException
import ru.bolvanchiki.repository.PostRepository
import java.util.*

@Service
class PostService(
    private val postRepository: PostRepository,
    private val userService: UserService,
    private val minioService: MinioService,
    private val redisCacheService: RedisCacheService,
    private val reactionService: ReactionService,
    private val postConversionService: PostConversionService
) {

    @Transactional
    fun createPost(
        username: String,
        request: CreatePostRequest
    ): Post {
        val user = userService.getByUsername(username)

        if (request.text.isNullOrBlank() && request.image == null) {
            throw BadRequestException("Post must contain text or image")
        }

        var imageKey: String? = null
        request.image?.let { image ->
            imageKey = minioService.uploadImage(username, image)
        }

        val post = Post(
            text = request.text,
            imageKey = imageKey,
            author = user
        )

        val savedPost = postRepository.save(post)

        if (redisCacheService.isUserInTopUsers(username)) {
            redisCacheService.addPostToCache(savedPost)
        }

        return savedPost
    }

    @Transactional
    fun deletePost(username: String, postId: UUID) {
        val post = getPostById(postId)

        if (post.author.username != username) {
            throw BadRequestException("You can only delete your own posts")
        }

        post.imageKey?.let { imageKey ->
            minioService.deleteImage(imageKey)
        }

        postRepository.delete(post)
        redisCacheService.removePostFromCache(postId)
    }

    fun getUserPosts(
        username: String,
        page: Int,
        size: Int,
        currentUsername: String? = null
    ): Page<Post> {
        val pageable: Pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))
        return postRepository.findByAuthorUsernameAndIsDeletedFalseOrderByCreatedAtDesc(username, pageable)
    }

    fun getPostById(postId: UUID): Post {
        return postRepository.findById(postId)
            .orElseThrow { NotFoundException("Post with id '$postId' not found") }
    }

    fun getPostsByUsernames(usernames: List<String>, pageable: Pageable): Page<Post> {
        return postRepository.findPostsByAuthors(usernames, pageable)
    }

    fun hasUserReacted(username: String, postId: UUID): Boolean {
        return reactionService.hasUserReacted(username, postId)
    }

    fun convertToResponseWithReaction(post: Post, currentUsername: String? = null): PostResponse {
        val baseResponse = postConversionService.convertToResponse(post)
        val hasReacted = if (currentUsername != null) {
            reactionService.hasUserReacted(currentUsername, post.id)
        } else false

        return baseResponse.copy(hasReacted = hasReacted)
    }
}