package com.omsk.kp.domain.service

import com.omsk.kp.domain.model.User
import com.omsk.kp.domain.repo.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class UserService(
    private val repo: UserRepository
) {
    @Transactional
    fun save(user: User) = repo.save(user)

    fun findFirstByEmailAndPasswordHash(email: String, passwordHash: String) =
        repo.findFirstByEmailAndPasswordHash(email, passwordHash)

    fun findByEmail(email: String) = repo.findByEmail(email)
}