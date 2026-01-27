package ru.bolvanchiki.service

import org.springframework.stereotype.Service
import ru.bolvanchiki.dto.response.PostResponse
import ru.bolvanchiki.entity.Post

@Service
class PostConversionServiceImpl(
    private val minioService: MinioService
) : PostConversionService {

    override fun convertToResponse(post: Post): PostResponse {
        val imageUrl = post.imageKey?.let { minioService.getImageUrl(it) }

        return PostResponse(
            id = post.id.toString(),
            img = imageUrl,
            text = post.text,
            author = post.author.username,
            date = post.createdAt.toInstant(),
            reactions = post.getReactionsCount(),
            comments = post.getCommentsCount(),
            hasReacted = false
        )
    }
}