package com.omsk.kp.domain.model

import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import java.time.Instant
import java.util.Date
import kotlin.let

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
    val supplier: String? = null,
    @Enumerated(EnumType.STRING)
    val temperatureMode: CommercialOfferDetailsTemperatureMode? = null,
    val priceListDate: Date? = null,
    val createdAt: Instant = Instant.now(),

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null
)

fun CommercialOfferDetails.getPriceInRub() = price / 100
fun CommercialOfferDetails.getPurchasePriceTotal() = quantity * getPriceInRub()
fun CommercialOfferDetails.getTotalWeight() = weightKg * quantity
fun CommercialOfferDetails.getMarkupPercentOrZero() = markupPercent ?: 0.0
fun CommercialOfferDetails.getMarkupExtraOrZero() = markupExtra ?: 0.0
fun CommercialOfferDetails.getMarkupTotal() = quantity * (getMarkupExtraOrZero() + ( getPriceInRub() * getMarkupPercentOrZero() / 100 ))
fun CommercialOfferDetails.getTransportExtraOrZero() = transportExtra ?: 0.0
fun CommercialOfferDetails.getTransportPercentOrZero() = transportPercent ?: 0.0
fun CommercialOfferDetails.getTransportTotal() = quantity * (getTransportExtraOrZero() + (weightKg * getTransportPercentOrZero()))
fun CommercialOfferDetails.getSellPriceTotal() = quantity * getPriceInRub() + getMarkupTotal() + getTransportTotal()
fun CommercialOfferDetails.getSellPrice() = getSellPriceTotal() / quantity
fun CommercialOfferDetails.getMarga() = getSellPriceTotal() - getPurchasePriceTotal() - getTransportTotal()
fun CommercialOfferDetails.getTemperatureModeOrDefault() = this.temperatureMode ?: CommercialOfferDetailsTemperatureMode.NO_TEMPERATURE

enum class CommercialOfferDetailsTemperatureMode(val desc: String, val code: Int){

    FROZEN("Заморозка", 1),
    COOLED("Охлажденка", 2),
    WARM("Тёплый", 3),
    NO_TEMPERATURE("Без температурный", 4);

    companion object {
        fun fromDesc(desc: String?) = desc?.let { map[it] }
        private val map = CommercialOfferDetailsTemperatureMode
            .entries
            .associateBy { it.desc }
    }
}