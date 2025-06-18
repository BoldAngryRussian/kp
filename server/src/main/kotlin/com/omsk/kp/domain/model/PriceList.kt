package com.omsk.kp.domain.model

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id
import java.time.Instant

@Entity
data class PriceList(
    @Id
    @GeneratedValue
    val id: Long? = null,
    val suppliersId: Long,
    var version: Int = 0,
    val createdAt: Instant = Instant.now()
)
