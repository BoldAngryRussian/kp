package com.omsk.kp.service

import com.omsk.kp.converter.SignUpRequestDTOToUser
import com.omsk.kp.domain.service.UserService
import com.omsk.kp.dto.SignUpRequestDTO
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class SignUpService(
    private val userService: UserService,
    private val signUpRequestDTOToUser: SignUpRequestDTOToUser
) {
    @Transactional
    fun signUp(request: SignUpRequestDTO) {
        val user = userService.findByEmail(request.email)

        if (user != null)
            throw RuntimeException("Пользователь с логином ${request.email} уже существует")

        signUpRequestDTOToUser
            .convert(request)
            .let(userService::save)
    }
}