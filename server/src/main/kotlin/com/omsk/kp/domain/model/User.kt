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

    val firstName: String,
    val secondName: String,
    val thirdName: String,
    val phone: String,
    val email: String,
    val details: String,
    val passwordHash: String,
    @Enumerated(EnumType.STRING)
    val role: UserRoleType = UserRoleType.USER,
    val createdAt: Instant = Instant.now(),

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null
)

enum class UserRoleType {
    USER, ADMIN
}
