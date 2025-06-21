package com.omsk.kp.converter

import com.omsk.kp.domain.model.User
import com.omsk.kp.domain.model.UserRoleType
import com.omsk.kp.dto.SignUpRequestDTO
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component

@Component
class SignUpRequestDTOToUser(
    private val passwordEncoder: PasswordEncoder
) {
    fun convert(request: SignUpRequestDTO) =
        User(
            request.firstName,
            request.secondName,
            request.thirdName,
            request.phone,
            request.email,
            "",
            passwordEncoder.encode(request.password),
            UserRoleType.EMPTY
        )
}