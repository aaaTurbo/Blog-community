package bolvanchiki.service

import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class CookieService {

    @Value("\${app.cookies.access-token.name}")
    private lateinit var accessTokenCookieName: String

    @Value("\${app.cookies.access-token.http-only}")
    private val accessTokenHttpOnly: Boolean = true

    @Value("\${app.cookies.access-token.secure}")
    private val accessTokenSecure: Boolean = false

    @Value("\${app.cookies.access-token.max-age}")
    private val accessTokenMaxAge: Int = 900

    @Value("\${app.cookies.access-token.path}")
    private lateinit var accessTokenPath: String

    @Value("\${app.cookies.access-token.same-site}")
    private lateinit var accessTokenSameSite: String

    @Value("\${app.cookies.refresh-token.name}")
    private lateinit var refreshTokenCookieName: String

    @Value("\${app.cookies.refresh-token.http-only}")
    private val refreshTokenHttpOnly: Boolean = true

    @Value("\${app.cookies.refresh-token.secure}")
    private val refreshTokenSecure: Boolean = false

    @Value("\${app.cookies.refresh-token.max-age}")
    private val refreshTokenMaxAge: Int = 604800

    @Value("\${app.cookies.refresh-token.path}")
    private lateinit var refreshTokenPath: String

    @Value("\${app.cookies.refresh-token.same-site}")
    private lateinit var refreshTokenSameSite: String

    fun setAccessTokenCookie(response: HttpServletResponse, token: String) {
        val cookie = Cookie(accessTokenCookieName, token)
        cookie.isHttpOnly = accessTokenHttpOnly
        cookie.secure = accessTokenSecure
        cookie.maxAge = accessTokenMaxAge
        cookie.path = accessTokenPath

        response.addCookie(cookie)

        response.addHeader("Set-Cookie", buildCookieHeader(cookie, accessTokenSameSite))
    }

    fun setRefreshTokenCookie(response: HttpServletResponse, token: String) {
        val cookie = Cookie(refreshTokenCookieName, token)
        cookie.isHttpOnly = refreshTokenHttpOnly
        cookie.secure = refreshTokenSecure
        cookie.maxAge = refreshTokenMaxAge
        cookie.path = refreshTokenPath
        response.addCookie(cookie)
        response.addHeader("Set-Cookie", buildCookieHeader(cookie, refreshTokenSameSite))
    }

    fun clearAccessTokenCookie(response: HttpServletResponse) {
        val cookie = Cookie(accessTokenCookieName, "")
        cookie.isHttpOnly = accessTokenHttpOnly
        cookie.secure = accessTokenSecure
        cookie.maxAge = 0
        cookie.path = accessTokenPath
        response.addCookie(cookie)
        response.addHeader("Set-Cookie", buildCookieHeader(cookie, accessTokenSameSite))
    }

    fun clearRefreshTokenCookie(response: HttpServletResponse) {
        val cookie = Cookie(refreshTokenCookieName, "")
        cookie.isHttpOnly = refreshTokenHttpOnly
        cookie.secure = refreshTokenSecure
        cookie.maxAge = 0
        cookie.path = refreshTokenPath
        response.addCookie(cookie)
        response.addHeader("Set-Cookie", buildCookieHeader(cookie, refreshTokenSameSite))
    }

    private fun buildCookieHeader(cookie: Cookie, sameSite: String): String {
        return "${cookie.name}=${cookie.value}; " +
                "Path=${cookie.path}; " +
                "Max-Age=${cookie.maxAge}; " +
                "HttpOnly=${cookie.isHttpOnly}; " +
                "Secure=${cookie.secure}; " +
                "SameSite=$sameSite"
    }
}