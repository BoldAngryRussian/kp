package com.omsk.kp.security

import com.omsk.kp.domain.model.User
import com.omsk.kp.domain.model.isUserWaitForAuthorization
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
        val user = userService.findByEmail(loginRequestDTO.email)
        if (user != null && user.isUserWaitForAuthorization())
            throw RuntimeException(VALIDATION_ERROR)
        return user
        /*
        На вреия тестирования
        return userService
            .findFirstByEmailAndPasswordHash(
                loginRequestDTO.email,
                passwordHash
            )

         */
    }

    companion object {
        const val VALIDATION_ERROR = "Пользователь находится на валидации. Обратитесь к администратору"
    }
}