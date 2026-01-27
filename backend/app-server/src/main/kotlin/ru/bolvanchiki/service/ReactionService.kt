package ru.bolvanchiki.service

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import ru.bolvanchiki.entity.Reaction
import ru.bolvanchiki.exception.NotFoundException
import ru.bolvanchiki.repository.PostRepository
import ru.bolvanchiki.repository.ReactionRepository
import java.util.*

@Service
class ReactionService(
    private val reactionRepository: ReactionRepository,
    private val userService: UserService,
    private val postRepo: PostRepository,
) {

    @Transactional
    fun toggleReaction(username: String, postId: UUID): Boolean {
        val user = userService.getByUsername(username)
        val post = postRepo.findById(postId).orElseThrow { NotFoundException("Post with id '$postId' not found") }

        val existingReaction = reactionRepository.findByUserUsernameAndPostId(username, postId)

        return if (existingReaction != null) {
            reactionRepository.delete(existingReaction)
            false
        } else {
            val reaction = Reaction(
                user = user,
                post = post
            )
            reactionRepository.save(reaction)
            true
        }
    }

    fun hasUserReacted(username: String, postId: UUID): Boolean {
        return reactionRepository.findByUserUsernameAndPostId(username, postId) != null
    }

    fun getReactionCount(postId: UUID): Long {
        return reactionRepository.countByPostId(postId)
    }
}