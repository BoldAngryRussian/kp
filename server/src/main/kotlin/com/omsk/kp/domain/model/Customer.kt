package com.omsk.kp.domain.model

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant

@Entity
@Table(name = "customers")
data class Customer(
    val company: String,
    val firstName: String,
    val secondName: String? = null,
    val thirdName: String? = null,
    val phone: String,
    val email: String? = null,
    val address: String? = null,
    val details: String? = null,
    val createdAt: Instant = Instant.now()
) {
    @Id
    @GeneratedValue
    val id: Long = 0
}