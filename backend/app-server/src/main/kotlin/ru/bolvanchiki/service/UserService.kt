package ru.bolvanchiki.service

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import ru.bolvanchiki.dto.response.UserResponse
import ru.bolvanchiki.entity.User
import ru.bolvanchiki.exception.NotFoundException
import ru.bolvanchiki.repository.UserRepository

@Service
class UserService(
    private val userRepository: UserRepository
) {

    fun getByUsername(username: String): User {
        return userRepository.findById(username)
            .orElseThrow { NotFoundException("User with username '$username' not found") }
    }

    fun findByExternalId(externalId: String): User? {
        return userRepository.findByExternalId(externalId)
    }

    @Transactional
    fun getOrCreateUserFromJwt(claims: Map<String, Any>): User {
        val externalId = claims["username"] as String

        val existingUser = userRepository.findByExternalId(externalId)

        return if (existingUser != null) {
            existingUser
        } else {
            val newUser = User(
                username = externalId,
                externalId = externalId
            )
            userRepository.save(newUser)
        }
    }

    fun getFollowedUsers(username: String): List<User> {
        return userRepository.findFollowedUsers(username)
    }

    fun getTopUsers(limit: Int): List<User> {
        val results = userRepository.findTopUsersByFollowerCount(limit)
        return results.mapNotNull { result ->
            val username = result[0] as String
            userRepository.findById(username).orElse(null)
        }
    }

    fun convertToResponse(user: User, followService: FollowService? = null, currentUsername: String? = null): UserResponse {
        val isFollowing = if (currentUsername != null && currentUsername != user.username && followService != null) {
            followService.isFollowing(currentUsername, user.username)
        } else false

        val followersCount = userRepository.countFollowers(user.username)
        val followingCount = userRepository.countFollowing(user.username)

        return UserResponse(
            id = user.username,
            username = user.username,
            isFollowing = isFollowing,
            followersCount = followersCount,
            followingCount = followingCount,
        )
    }
}