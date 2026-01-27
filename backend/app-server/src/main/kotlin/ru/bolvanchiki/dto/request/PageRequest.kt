package ru.bolvanchiki.dto.request

data class PageRequest(
    val page: Int = 0,
    val size: Int = 20,
    val lastId: String? = null
)