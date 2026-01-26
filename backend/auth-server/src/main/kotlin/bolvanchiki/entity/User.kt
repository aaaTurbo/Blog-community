package bolvanchiki.entity

import jakarta.persistence.*

@Entity
@Table(name = "users")
data class User(

    @Id
    val username: String,

    @Column(unique = true, nullable = false, length = 100)
    var email: String,

    @Column(nullable = false)
    var passwordHash: String,

)