package com.omsk.kp.domain.service.save_kp

import com.omsk.kp.domain.service.CommercialOfferDetailsDescriptionService
import com.omsk.kp.domain.service.save_kp.converter.KPSaveDtoToCommercialOfferDetails
import com.omsk.kp.dto.KPSaveDTO
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class KPDetailsService(
    private val commercialOfferDetailsService: CommercialOfferDetailsService,
    private val commercialOfferDetailsDescriptionService: CommercialOfferDetailsDescriptionService
) {

    private val kpSaveDtoToCommercialOfferDetails = KPSaveDtoToCommercialOfferDetails()

    @Transactional
    fun save(offerId: Long, dto: KPSaveDTO){
        kpSaveDtoToCommercialOfferDetails
            .convert(dto, offerId)
            .let(commercialOfferDetailsService::saveAll)

        dto.terms
            ?.let { desc ->
                commercialOfferDetailsDescriptionService
                    .save(desc, offerId)
            }
    }
}