package com.omsk.kp.domain.service

import com.omsk.kp.domain.repo.UserRepository
import org.springframework.stereotype.Service

@Service
class UserService(
    private val repo: UserRepository
) {
    fun findFirstByEmailAndPasswordHash(email: String, passwordHash: String) =
        repo.findFirstByEmailAndPasswordHash(email, passwordHash)

    fun findByEmail(email: String) = repo.findByEmail(email)
}