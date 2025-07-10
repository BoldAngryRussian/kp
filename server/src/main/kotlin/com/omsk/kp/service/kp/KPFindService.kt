package com.omsk.kp.service.kp

import com.omsk.kp.domain.model.CommercialOfferDetails
import com.omsk.kp.domain.service.CommercialOfferDetailsDescriptionService
import com.omsk.kp.domain.service.save_kp.CommercialOfferDetailsService
import com.omsk.kp.domain.service.save_kp.CommercialOfferService
import org.springframework.stereotype.Service
import java.text.SimpleDateFormat
import java.util.Locale

@Service
class KPFindService(
    private val commercialOfferService: CommercialOfferService,
    private val commercialOfferDetailsService: CommercialOfferDetailsService,
    private val commercialOfferDetailsDescriptionService: CommercialOfferDetailsDescriptionService
) {
    fun findByOfferId(offerId: Long): KPFindSavedDTO {
        val offer = commercialOfferService
            .findById(offerId)
            ?: throw RuntimeException("Коммерческое предложение не найдено!")

        val products = commercialOfferDetailsService
            .findAllByOfferId(offerId)

        val desc = commercialOfferDetailsDescriptionService
            .findByOfferId(offerId)
            ?.description

        if (products.isEmpty())
            throw RuntimeException("В коммерческом предложении нет продуктов!")

        return KPFindSavedDTO(
            offerId,
            offer.customerId,
            desc,
            products.map { CommercialOfferDetailsFindDTO(it) }
        )
    }
}

data class KPFindSavedDTO(
    val offerId: Long,
    val customerId: Long,
    val desc: String? = null,
    val products: List<CommercialOfferDetailsFindDTO>
)

data class CommercialOfferDetailsFindDTO(
    val name: String,
    val price: Int,
    val markupExtra: Double? = null,
    val markupPercent: Double? = null,
    val transportExtra: Double? = null,
    val transportPercent: Double? = null,
    val quantity: Int,
    val weightKg: Double,
    val supplier: String? = null,
    val temperatureMode: String? = null,
    val priceListDate: String? = null,
    val measurement: String
) {
    constructor(details: CommercialOfferDetails) :
            this(
                details.name,
                details.price,
                details.markupExtra,
                details.markupPercent,
                details.transportExtra,
                details.transportPercent,
                details.quantity,
                details.weightKg,
                details.supplier,
                details.temperatureMode?.desc,
                details.priceListDate
                    ?.let { SimpleDateFormat("dd-MM-yyyy", Locale.getDefault()).format(it) },
                details.measurement
            )
}