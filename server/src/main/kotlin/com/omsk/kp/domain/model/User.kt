package com.omsk.kp.domain.model

import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant

@Entity
@Table(name = "users")
data class User(

    var firstName: String,
    var secondName: String,
    var thirdName: String,
    var phone: String,
    var email: String,
    var details: String,
    var passwordHash: String,
    @Enumerated(EnumType.STRING)
    val role: UserRoleType = UserRoleType.EMPTY,
    val createdAt: Instant = Instant.now(),

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null
)

enum class UserRoleType {
    EMPTY, USER, ADMIN
}

fun User.isUserWaitForAuthorization() = role == UserRoleType.EMPTY
