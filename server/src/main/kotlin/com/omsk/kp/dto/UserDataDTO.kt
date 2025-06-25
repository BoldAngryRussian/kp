package com.omsk.kp.dto

import com.omsk.kp.domain.model.User

data class UserDataDTO(
    val firstName: String,
    val secondName: String,
    val thirdName: String,
    val phone: String,
    val email: String,
    val details: String,
) {
    constructor(user: User): this(
        user.firstName,
        user.secondName,
        user.thirdName,
        user.phone,
        user.email,
        user.details
    )
}
