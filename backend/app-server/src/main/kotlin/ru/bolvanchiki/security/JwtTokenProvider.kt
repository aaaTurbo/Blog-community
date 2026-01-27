package ru.bolvanchiki.security

import io.jsonwebtoken.Jwts
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.security.KeyFactory
import java.security.PublicKey
import java.security.spec.X509EncodedKeySpec
import java.util.*

@Suppress("UNCHECKED_CAST")
@Component
class JwtTokenProvider {

    @Value("\${app.auth-service.public-key}")
    private lateinit var publicKeyPem: String

    @Value("\${app.auth-service.issuer}")
    private lateinit var issuer: String

    private val publicKey: PublicKey by lazy {
        try {
            val keyBytes = extractKeyBytes(publicKeyPem)
            val keySpec = X509EncodedKeySpec(keyBytes)
            val keyFactory = KeyFactory.getInstance("RSA")
            keyFactory.generatePublic(keySpec)
        } catch (e: Exception) {
            throw RuntimeException("Failed to load public key from auth-service: ${e.message}", e)
        }
    }

    fun validateToken(token: String): Boolean {
        return try {
            val claims = Jwts.parser()
                .verifyWith(publicKey)
                .build()
                .parseSignedClaims(token)
                .payload

            claims.issuer == issuer && claims.expiration.after(Date())
        } catch (e: Exception) {
            false
        }
    }

    fun getClaims(token: String): Map<String, Any> {
        val claims = Jwts.parser()
            .verifyWith(publicKey)
            .build()
            .parseSignedClaims(token)
            .payload

        return mapOf(
            "sub" to claims.subject,
            "username" to (claims["username"] ?: claims.subject),
            "email" to claims["email"],
            "iss" to claims.issuer,
            "exp" to claims.expiration.time,
            "iat" to claims.issuedAt.time
        ) as Map<String, Any>
    }

    private fun extractKeyBytes(keyPem: String): ByteArray {
        var cleanedKey = keyPem
            .trim()

        return try {
            Base64.getDecoder().decode(cleanedKey)
        } catch (e: Exception) {
            throw RuntimeException("Failed to decode base64 public key: ${e.message}", e)
        }
    }
}