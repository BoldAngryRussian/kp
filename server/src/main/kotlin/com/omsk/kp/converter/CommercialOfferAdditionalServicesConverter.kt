package com.omsk.kp.converter

import com.omsk.kp.domain.model.CommercialOfferAdditionalServices
import com.omsk.kp.dto.KPSaveDTO

class CommercialOfferAdditionalServicesConverter {
    fun convert(offerId: Long, dto: KPSaveDTO) =
        dto
            .additionalServices
            .map {
                CommercialOfferAdditionalServices(
                    commercialOfferId = offerId,
                    type = it.type,
                    count = it.count,
                    price = it.price
                )
            }
}