package com.omsk.kp.domain.service

import com.omsk.kp.dto.LoginRequestDTO
import com.omsk.kp.security.AuthService
import com.omsk.kp.security.JwtService
import org.springframework.stereotype.Service

@Service
class UserLoginService(
    private val authService: AuthService,
    private val jwtService: JwtService
) {
    fun getToken(loginRequestDTO: LoginRequestDTO): String? =
        authService
            .authenticate(loginRequestDTO)
            ?.let {
                jwtService
                    .generateToken(it.email, listOf(it.role))
            }
}