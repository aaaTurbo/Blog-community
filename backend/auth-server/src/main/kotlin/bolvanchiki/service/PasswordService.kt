package bolvanchiki.service

import at.favre.lib.crypto.bcrypt.BCrypt
import org.springframework.stereotype.Service

@Service
class PasswordService {

    fun hashPassword(password: String): String {
        return BCrypt.withDefaults().hashToString(12, password.toCharArray())
    }

    fun verifyPassword(password: String, hash: String): Boolean {
        return BCrypt.verifyer().verify(password.toCharArray(), hash).verified
    }
}