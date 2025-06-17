package com.omsk.kp.dto

data class ContactSaveDTO(
    val id: Long? = null,
    val firstName: String,
    val secondName: String,
    val thirdName: String? = null,
    val company: String,
    val department: String? = null,
    val email: String? = null,
    val phone: String,
    val details: String? = null,
    val address: String? = null
)