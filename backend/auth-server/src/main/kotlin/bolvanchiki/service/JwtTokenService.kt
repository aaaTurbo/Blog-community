package bolvanchiki.service

import bolvanchiki.entity.User
import io.jsonwebtoken.Jwts
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.security.KeyFactory
import java.security.PrivateKey
import java.security.PublicKey
import java.security.spec.PKCS8EncodedKeySpec
import java.security.spec.X509EncodedKeySpec
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.*

@Service
class JwtTokenService {

    @Value("\${app.security.jwt.private-key}")
    private lateinit var privateKeyPem: String

    @Value("\${app.security.jwt.public-key}")
    private lateinit var publicKeyPem: String

    @Value("\${app.security.jwt.access-token-expiration-minutes:15}")
    private val accessTokenExpirationMinutes: Long = 15

    @Value("\${app.security.jwt.refresh-token-expiration-days:7}")
    private val refreshTokenExpirationDays: Long = 7

    @Value("\${app.security.jwt.issuer:auth-service}")
    private lateinit var issuer: String

    private val privateKey: PrivateKey by lazy {
        val keyBytes = privateKeyPem
            .trim()
            .decodeBase64()

        val keySpec = PKCS8EncodedKeySpec(keyBytes)
        val keyFactory = KeyFactory.getInstance("RSA")
        keyFactory.generatePrivate(keySpec)
    }

    private val publicKey: PublicKey by lazy {
        val keyBytes = publicKeyPem
            .trim()
            .decodeBase64()

        val keySpec = X509EncodedKeySpec(keyBytes)
        val keyFactory = KeyFactory.getInstance("RSA")
        keyFactory.generatePublic(keySpec)
    }

    fun generateAccessToken(user: User): String {
        val now = Instant.now()
        val expiration = now.plus(accessTokenExpirationMinutes, ChronoUnit.MINUTES)


        return Jwts.builder()
            .issuer(issuer)
            .subject(user.username)
            .claim("username", user.username)
            .claim("email", user.email)
            .issuedAt(Date.from(now))
            .expiration(Date.from(expiration))
            .signWith(privateKey)
            .compact()
    }

    fun generateRefreshToken(): String {
        return UUID.randomUUID().toString()
    }

    fun getRefreshTokenExpiration(): Instant {
        return Instant.now().plus(refreshTokenExpirationDays, ChronoUnit.DAYS)
    }

    fun validateToken(token: String): Boolean {
        return try {
            Jwts.parser()
                .verifyWith(publicKey)
                .build()
                .parseSignedClaims(token)
                .payload.issuer == issuer
            true
        } catch (e: Exception) {
            false
        }
    }

    fun getClaims(token: String): Map<String, Any?> {
        val claims = Jwts.parser()
            .verifyWith(publicKey)
            .build()
            .parseSignedClaims(token)
            .payload

        return mapOf(
            "sub" to claims.subject,
            "username" to claims["username"],
            "email" to claims["email"],
            "iss" to claims.issuer,
            "exp" to claims.expiration.time,
            "iat" to claims.issuedAt.time
        )
    }

    private fun String.decodeBase64(): ByteArray {
        return Base64.getDecoder().decode(this)
    }
}