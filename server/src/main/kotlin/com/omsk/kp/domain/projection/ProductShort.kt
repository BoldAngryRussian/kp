package com.omsk.kp.domain.projection

interface ProductShort {
    val id: Long
    val name: String
    val price: Long
    val measurement: String
    val company: String
    val date: String
}