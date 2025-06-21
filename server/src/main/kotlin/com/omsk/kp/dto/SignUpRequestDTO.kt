package com.omsk.kp.dto

data class SignUpRequestDTO(
    val firstName: String,
    val secondName: String,
    val thirdName: String,
    val phone: String,
    val email: String,
    val password: String,
)
