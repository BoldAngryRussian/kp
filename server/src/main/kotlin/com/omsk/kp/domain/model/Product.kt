package com.omsk.kp.domain.model

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id
import java.time.Instant

@Entity
data class Product(
    @Id
    @GeneratedValue
    val id: Long? = null,
    val name: String,
    val price: Long,
    val priceListId: Long,
    val priceListVersion: Int,
    val measurement: String,
    val createdAt: Instant = Instant.now()
)
