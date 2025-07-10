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
    fun authenticate(loginRequestDTO: LoginRequestDTO): User {
        val user = userService.findByEmail(loginRequestDTO.email)
        if (user == null)
            throw RuntimeException("Пользователь ${loginRequestDTO.email} в системе не обнаружен!")
        if (user.isUserWaitForAuthorization())
            throw RuntimeException(VALIDATION_ERROR)

        return when (passwordEncoder.matches(loginRequestDTO.password, user.passwordHash)){
            true -> user
            else -> throw RuntimeException("В доступе отказано!")
        }
    }

    companion object {
        const val VALIDATION_ERROR = "Пользователь находится на валидации. Обратитесь к администратору"
    }
}