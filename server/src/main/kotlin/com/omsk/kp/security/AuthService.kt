package com.omsk.kp.security

import com.omsk.kp.domain.model.User
import com.omsk.kp.domain.service.UserService
import com.omsk.kp.dto.LoginRequestDTO
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val userService: UserService,
    private val passwordEncoder: PasswordEncoder
) {
    fun authenticate(loginRequestDTO: LoginRequestDTO): User? {
        val passwordHash = passwordEncoder.encode(loginRequestDTO.password)
        return userService
            .findByEmail(loginRequestDTO.email)
        /*
        На вреия тестирования
        return userService
            .findFirstByEmailAndPasswordHash(
                loginRequestDTO.email,
                passwordHash
            )

         */
    }
}