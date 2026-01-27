package ru.bolvanchiki.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import ru.bolvanchiki.entity.UserFollow
import java.util.*

interface UserFollowRepository : JpaRepository<UserFollow, UUID> {
    fun findByFollowerUsernameAndFollowedUsername(
        followerUsername: String,
        followedUsername: String
    ): UserFollow?

    @Query("""
        SELECT COUNT(uf) > 0 FROM UserFollow uf 
        WHERE uf.follower.username = :followerUsername 
        AND uf.followed.username = :followedUsername
    """)
    fun existsByFollowerUsernameAndFollowedUsername(
        @Param("followerUsername") followerUsername: String,
        @Param("followedUsername") followedUsername: String
    ): Boolean

    fun deleteByFollowerUsernameAndFollowedUsername(
        followerUsername: String,
        followedUsername: String
    )

    @Query("""
        SELECT uf.followed.username FROM UserFollow uf 
        WHERE uf.follower.username = :username
    """)
    fun findFollowedUsernames(@Param("username") username: String): List<String>
}