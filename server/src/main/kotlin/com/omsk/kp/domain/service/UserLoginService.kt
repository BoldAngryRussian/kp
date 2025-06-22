package com.omsk.kp.domain.service

import com.omsk.kp.dto.LoginRequestDTO
import com.omsk.kp.dto.TokenUserInfoDTO
import com.omsk.kp.security.AuthService
import com.omsk.kp.security.JwtService
import org.springframework.stereotype.Service

@Service
class UserLoginService(
    private val authService: AuthService,
    private val jwtService: JwtService
) {
    fun getTokenWithUser(loginRequestDTO: LoginRequestDTO): TokenUserInfoDTO {
        val user = authService
            .authenticate(loginRequestDTO)
        val token = jwtService.generateToken(user.email, listOf(user.role))

        return TokenUserInfoDTO(token, user)
    }
}