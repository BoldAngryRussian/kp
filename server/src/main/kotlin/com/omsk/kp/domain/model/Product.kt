package com.omsk.kp.domain.model

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id

@Entity
data class Product(
    val name: String,
    val price: Double
){
    @Id
    @GeneratedValue
    val id: Long = 0
}
