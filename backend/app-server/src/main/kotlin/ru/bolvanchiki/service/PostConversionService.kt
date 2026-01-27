package ru.bolvanchiki.service

import ru.bolvanchiki.dto.response.PostResponse
import ru.bolvanchiki.entity.Post

interface PostConversionService {
    fun convertToResponse(post: Post): PostResponse
}