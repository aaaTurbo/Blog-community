package ru.bolvanchiki.security

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.slf4j.LoggerFactory
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtAuthFilter(
    private val jwtTokenProvider: JwtTokenProvider,
    private val userService: ru.bolvanchiki.service.UserService
) : OncePerRequestFilter() {

    private val logger = LoggerFactory.getLogger(JwtAuthFilter::class.java)

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        logger.debug("Processing request to: ${request.servletPath}")

        if (shouldNotFilter(request)) {
            filterChain.doFilter(request, response)
            return
        }

        val token = extractTokenFromHeader(request)

        logger.debug(token)

        if (token == null) {
            logger.debug("No token found")
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authentication required")
            return
        }

        if (!jwtTokenProvider.validateToken(token)) {
            logger.debug("Invalid token")
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token")
            return
        }

        try {
            val claims = jwtTokenProvider.getClaims(token)
            val user = userService.getOrCreateUserFromJwt(claims)

            val authentication = UsernamePasswordAuthenticationToken(
                user,
                null,
                emptyList()
            )
            authentication.details = WebAuthenticationDetailsSource().buildDetails(request)
            SecurityContextHolder.getContext().authentication = authentication

            logger.debug("Authenticated user: ${user.username}")

        } catch (e: Exception) {
            logger.error("Error processing token", e)
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token processing error")
            return
        }

        filterChain.doFilter(request, response)
    }

    private fun extractTokenFromHeader(request: HttpServletRequest): String? {
        val bearerToken = request.getHeader("Authorization")
        return if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            bearerToken.substring(7)
        } else null
    }

    override fun shouldNotFilter(request: HttpServletRequest): Boolean {
        val path = request.servletPath

        return when {

            path.startsWith("/error") -> true

            else -> false
        }
    }
}