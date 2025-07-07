package com.omsk.kp.service.kp

import com.omsk.kp.domain.model.CommercialOfferDetails
import com.omsk.kp.domain.service.save_kp.CommercialOfferDetailsService
import com.omsk.kp.domain.service.save_kp.CommercialOfferService
import org.springframework.stereotype.Service

@Service
class KPFindService(
    private val commercialOfferService: CommercialOfferService,
    private val commercialOfferDetailsService: CommercialOfferDetailsService,
) {
    fun findByOfferId(offerId: Long): KPFindSavedDTO {
        val offer = commercialOfferService
            .findById(offerId)
            ?: throw RuntimeException("Коммерческое предложение не найдено!")

        val products = commercialOfferDetailsService
            .findAllByOfferId(offerId)

        if (products.isEmpty())
            throw RuntimeException("В коммерческом предложении нет продуктов!")

        return KPFindSavedDTO(
            offerId,
            offer.customerId,
            products
        )
    }
}

data class KPFindSavedDTO(
    val offerId: Long,
    val customerId: Long,
    val products: List<CommercialOfferDetails>
)