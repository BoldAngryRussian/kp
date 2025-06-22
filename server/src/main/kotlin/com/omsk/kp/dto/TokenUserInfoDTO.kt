package com.omsk.kp.dto

import com.omsk.kp.domain.model.User
import com.omsk.kp.domain.model.UserRoleType

data class TokenUserInfoDTO(
    val token: String,
    val email: String,
    val firstName: String,
    val secondName: String,
    val thirdName: String,
    val role: UserRoleType,
    val userId: String
){
    constructor(token: String, user: User):
            this(
                token,
                user.email,
                user.firstName,
                user.secondName,
                user.thirdName,
                user.role,
                user.id!!.toString()
            )
}
