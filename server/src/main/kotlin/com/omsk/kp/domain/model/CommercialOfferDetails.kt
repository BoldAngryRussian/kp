package com.omsk.kp.domain.model

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import java.time.Instant

@Entity
data class CommercialOfferDetails(
    val name: String,
    val price: Int,
    val markupExtra: Double? = null,
    val markupPercent: Double? = null,
    val transportExtra: Double? = null,
    val transportPercent: Double? = null,
    val quantity: Int,
    val weightKg: Double,
    val commercialOfferId: Long,
    val createdAt: Instant = Instant.now(),

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null
)
