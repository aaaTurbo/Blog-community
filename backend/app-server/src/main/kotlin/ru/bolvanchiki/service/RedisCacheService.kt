package ru.bolvanchiki.service

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import ru.bolvanchiki.dto.response.PostResponse
import ru.bolvanchiki.entity.Post
import java.util.*
import java.util.concurrent.TimeUnit

@Service
class RedisCacheService(
    private val redisTemplate: RedisTemplate<String, String>,
    private val userRepository: ru.bolvanchiki.repository.UserRepository,
    private val postConversionService: PostConversionService,
    private val objectMapper: ObjectMapper
) {

    @Value("\${app.cache.post.ttl-minutes:30}")
    private val ttlMinutes: Long = 30

    @Value("\${app.cache.post.top-users-limit:10}")
    private val topUsersLimit: Int = 10

    @Value("\${app.cache.post.feed-size:100}")
    private val feedSize: Int = 100

    companion object {
        private const val TOP_USERS_KEY = "cache:top_users"
        private const val USER_POSTS_PREFIX = "cache:user_posts:"
        private const val FEED_PREFIX = "cache:feed:"
        private const val POST_PREFIX = "cache:post:"
    }

    fun isUserInTopUsers(username: String): Boolean {
        val topUsers = getTopUsersFromCache()
        return topUsers.contains(username)
    }

    fun addPostToCache(post: Post) {
        val username = post.author.username
        val userPostsKey = "$USER_POSTS_PREFIX$username"

        val postResponse = postConversionService.convertToResponse(post)
        val postJson = objectMapper.writeValueAsString(postResponse)

        redisTemplate.opsForList().leftPush(userPostsKey, postJson)
        redisTemplate.opsForList().trim(userPostsKey, 0, feedSize - 1L)
        redisTemplate.expire(userPostsKey, ttlMinutes, TimeUnit.MINUTES)

        val postKey = "$POST_PREFIX${post.id}"
        redisTemplate.opsForValue().set(postKey, postJson, ttlMinutes, TimeUnit.MINUTES)

        updateFollowersFeeds(username, postResponse)
    }

    fun getCachedFeed(username: String, page: Int, size: Int): List<PostResponse> {
        val feedKey = "$FEED_PREFIX$username"
        val start = page * size
        val end = start + size - 1

        val cachedJson = redisTemplate.opsForList().range(feedKey, start.toLong(), end.toLong())

        return cachedJson?.mapNotNull { json ->
            try {
                objectMapper.readValue(json, PostResponse::class.java)
            } catch (e: Exception) {
                null
            }
        } ?: emptyList()
    }

    fun getCachedPost(postId: UUID): PostResponse? {
        val postKey = "$POST_PREFIX$postId"
        val cachedJson = redisTemplate.opsForValue().get(postKey)

        return if (cachedJson != null) {
            try {
                objectMapper.readValue(cachedJson, PostResponse::class.java)
            } catch (e: Exception) {
                null
            }
        } else null
    }

    fun removePostFromCache(postId: UUID) {
        val postKey = "$POST_PREFIX$postId"
        redisTemplate.delete(postKey)
    }

    @Scheduled(fixedDelay = 5 * 60 * 1000)
    fun updateTopUsersCache() {
        val topUsers = userRepository.findTopUsersByFollowerCount(topUsersLimit)
        val topUsernames = topUsers.map { it[0] as String }

        redisTemplate.opsForValue().set(TOP_USERS_KEY, objectMapper.writeValueAsString(topUsernames))
        redisTemplate.expire(TOP_USERS_KEY, ttlMinutes, TimeUnit.MINUTES)
    }

    private fun getTopUsersFromCache(): List<String> {
        val cached = redisTemplate.opsForValue().get(TOP_USERS_KEY)
        return if (cached != null) {
            try {
                objectMapper.readValue(cached, Array<String>::class.java).toList()
            } catch (e: Exception) {
                emptyList()
            }
        } else {
            emptyList()
        }
    }

    private fun updateFollowersFeeds(authorUsername: String, postResponse: PostResponse) {
        val user = userRepository.findById(authorUsername).orElse(null) ?: return

        user.followers.forEach { follow ->
            val followerUsername = follow.follower.username
            val feedKey = "$FEED_PREFIX$followerUsername"

            val postJson = objectMapper.writeValueAsString(postResponse)
            redisTemplate.opsForList().leftPush(feedKey, postJson)

            redisTemplate.opsForList().trim(feedKey, 0, (feedSize - 1).toLong())
            redisTemplate.expire(feedKey, ttlMinutes, TimeUnit.MINUTES)
        }
    }

    fun clearUserCache(username: String) {
        val userPostsKey = "$USER_POSTS_PREFIX$username"
        redisTemplate.delete(userPostsKey)
    }

    fun clearUserFeedCache(username: String) {
        val feedKey = "$FEED_PREFIX$username"
        redisTemplate.delete(feedKey)
    }
}