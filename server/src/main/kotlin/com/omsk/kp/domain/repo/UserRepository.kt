package com.omsk.kp.domain.repo

import com.omsk.kp.domain.model.User
import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository: JpaRepository<User, Long> {
    fun findFirstByEmailAndPasswordHash(email: String, passwordHash: String): User?
    fun findByEmail(email: String): User?
}