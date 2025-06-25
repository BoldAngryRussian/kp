package com.omsk.kp.domain.model

import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import java.time.Instant

@Entity
data class CommercialOffer(
    val managerId: Long,
    val customerId: Long,
    @Enumerated(EnumType.STRING)
    var type: CommercialOfferType = CommercialOfferType.NEW,
    val createdAt: Instant = Instant.now(),

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null
)

enum class CommercialOfferType {
    NEW,
    WAIT_CUSTOMER,
    FINISHED;

    companion object {
        private val map = entries.associateBy { it.name }
        fun fromString(value: String): CommercialOfferType? = map[value]
    }
}
