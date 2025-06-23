package com.omsk.kp.domain.model

import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import java.time.Instant

@Entity
data class CommercialOfferHistory(
    val commercialOfferId: Long,
    val userId: Long,
    @Enumerated(EnumType.STRING)
    val userAction: CommercialOfferHistoryType = CommercialOfferHistoryType.CREATE,
    val createdAt: Instant = Instant.now(),

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null
)

enum class CommercialOfferHistoryType{
    CREATE,
    DATA_CHANGE,
    STATUS_CHANGED,
    CLOSED
}
