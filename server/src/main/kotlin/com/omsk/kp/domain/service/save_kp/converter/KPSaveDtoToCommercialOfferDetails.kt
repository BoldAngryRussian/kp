package com.omsk.kp.domain.service.save_kp.converter

import com.omsk.kp.domain.model.CommercialOfferDetails
import com.omsk.kp.domain.model.CommercialOfferDetailsTemperatureMode
import com.omsk.kp.dto.KPSaveDTO

class KPSaveDtoToCommercialOfferDetails {
    fun convert(dto: KPSaveDTO, commercialOfferId: Long) =
        dto
            .elems
            .map {
                CommercialOfferDetails(
                    it.name,
                    it.price,
                    it.markupExtra,
                    it.markupPercent,
                    it.transportExtra,
                    it.transportPercent,
                    it.quantity,
                    it.weightKg,
                    commercialOfferId,
                    it.supplier,
                    CommercialOfferDetailsTemperatureMode.fromDesc(it.temperatureMode),
                    priceListDate = it.priceListDate,
                    measurement = it.measurement
                )
            }
}