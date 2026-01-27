package ru.bolvanchiki.service

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import ru.bolvanchiki.entity.UserFollow
import ru.bolvanchiki.exception.BadRequestException
import ru.bolvanchiki.repository.UserFollowRepository
import ru.bolvanchiki.repository.UserRepository

@Service
class FollowService(
    private val userFollowRepository: UserFollowRepository,
    private val userRepository: UserRepository
) {

    @Transactional
    fun followUser(followerUsername: String, usernameToFollow: String) {
        if (followerUsername == usernameToFollow) {
            throw BadRequestException("Cannot follow yourself")
        }

        val existingFollow = userFollowRepository.findByFollowerUsernameAndFollowedUsername(
            followerUsername,
            usernameToFollow
        )
        if (existingFollow != null) {
            throw BadRequestException("Already following this user")
        }

        val follower = userRepository.findById(followerUsername)
            .orElseThrow { BadRequestException("Follower not found: $followerUsername") }
        val userToFollow = userRepository.findById(usernameToFollow)
            .orElseThrow { BadRequestException("User to follow not found: $usernameToFollow") }

        val follow = UserFollow(
            follower = follower,
            followed = userToFollow
        )

        userFollowRepository.save(follow)
    }

    @Transactional
    fun unfollowUser(followerUsername: String, usernameToUnfollow: String) {
        userFollowRepository.deleteByFollowerUsernameAndFollowedUsername(
            followerUsername,
            usernameToUnfollow
        )
    }

    fun isFollowing(followerUsername: String, followedUsername: String): Boolean {
        return userFollowRepository.existsByFollowerUsernameAndFollowedUsername(
            followerUsername,
            followedUsername
        )
    }

    fun getFollowedUsernames(username: String): List<String> {
        return userFollowRepository.findFollowedUsernames(username)
    }
}