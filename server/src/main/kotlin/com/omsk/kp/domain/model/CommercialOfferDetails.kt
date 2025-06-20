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
    val markupExtra: Int? = null,
    val markupPercent: Int? = null,
    val transportExtra: Int? = null,
    val transportPercent: Int? = null,
    val quantity: Int,
    val weightKg: Int,
    val commercialOfferId: Long,
    val createdAt: Instant = Instant.now(),

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null
)
