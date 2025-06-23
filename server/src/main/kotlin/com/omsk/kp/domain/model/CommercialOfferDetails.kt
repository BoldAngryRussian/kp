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

fun CommercialOfferDetails.getPurchasePrice() = quantity * price / 100
fun CommercialOfferDetails.getTotalWeight() = weightKg * quantity
fun CommercialOfferDetails.getMarkupPercentOrZero() = markupPercent ?: 0.0
fun CommercialOfferDetails.getMarkupExtraOrZero() = markupExtra ?: 0.0
fun CommercialOfferDetails.getMarkupTotal() = quantity * (getMarkupExtraOrZero() + ( getPurchasePrice() * getMarkupPercentOrZero() / 100 ))
fun CommercialOfferDetails.getTransportExtraOrZero() = transportExtra ?: 0.0
fun CommercialOfferDetails.getTransportPercentOrZero() = transportPercent ?: 0.0
fun CommercialOfferDetails.getTransportTotal() = quantity * (getTransportExtraOrZero() + (getTotalWeight() * getTransportPercentOrZero()))
fun CommercialOfferDetails.getSellPrice() = getPurchasePrice() + getMarkupTotal() + getTransportTotal()
fun CommercialOfferDetails.getMarga() = getSellPrice() - getPurchasePrice() - getTransportTotal()