package com.omsk.kp.dto

data class ProductDTO(
    val name: String,
    val price: Long,
    val measurement: String,
    val isCorrect: Boolean = true
)
