package ru.bolvanchiki.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import ru.bolvanchiki.entity.User

interface UserRepository : JpaRepository<User, String> {
    fun findByExternalId(externalId: String): User?

    @Query("""
        SELECT u FROM User u 
        WHERE u.username IN (
            SELECT uf.followed.username FROM UserFollow uf 
            WHERE uf.follower.username = :username
        )
    """)
    fun findFollowedUsers(@Param("username") username: String): List<User>

    @Query("""
        SELECT COUNT(uf) FROM UserFollow uf 
        WHERE uf.followed.username = :username
    """)
    fun countFollowers(@Param("username") username: String): Long

    @Query("""
        SELECT COUNT(uf) FROM UserFollow uf 
        WHERE uf.follower.username = :username
    """)
    fun countFollowing(@Param("username") username: String): Long

    @Query("""
        SELECT u.username, COUNT(uf.id) as followerCount 
        FROM User u 
        LEFT JOIN u.followers uf 
        GROUP BY u.username 
        ORDER BY followerCount DESC 
        LIMIT :limit
    """)
    fun findTopUsersByFollowerCount(@Param("limit") limit: Int): List<Array<Any>>
}