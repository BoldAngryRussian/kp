package com.omsk.kp.domain.model

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id

@Entity
data class CommercialOfferTotal(
    val commercialOfferId: Long,
    val weight: Double,
    val pricePurchase: Double,
    val priceTransport: Double,
    val priceSell: Double,
    val marga: Double,
    val additionalServices: Double,

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null
)

fun CommercialOfferTotal?.getWeight() = this?.weight ?: 0.0
fun CommercialOfferTotal?.getPricePurchase() = this?.pricePurchase ?: 0.0
fun CommercialOfferTotal?.getPriceTransport() = this?.priceTransport ?: 0.0
fun CommercialOfferTotal?.getPriceSell() = this?.priceSell ?: 0.0
fun CommercialOfferTotal?.getMarga() = this?.marga ?: 0.0
fun CommercialOfferTotal?.getAdditionalServices() = this?.additionalServices ?: 0.0