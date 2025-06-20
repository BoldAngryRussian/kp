package com.omsk.kp.domain.service.save_kp

import com.omsk.kp.domain.service.CommercialOfferDetailsDescriptionService
import com.omsk.kp.domain.service.save_kp.converter.KPSaveDtoToCommercialOffer
import com.omsk.kp.domain.service.save_kp.converter.KPSaveDtoToCommercialOfferDetails
import com.omsk.kp.dto.KPSaveDTO
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class KPSaveService(
    private val commercialOfferService: CommercialOfferService,
    private val commercialOfferDetailsService: CommercialOfferDetailsService,
    private val commercialOfferDetailsDescriptionService: CommercialOfferDetailsDescriptionService
) {

    private val kpSaveDtoToCommercialOffer = KPSaveDtoToCommercialOffer()
    private val kpSaveDtoToCommercialOfferDetails = KPSaveDtoToCommercialOfferDetails()

    @Transactional
    fun save(dto: KPSaveDTO) {
        val offer = kpSaveDtoToCommercialOffer
            .convert(dto)
            .let( commercialOfferService::save )

        kpSaveDtoToCommercialOfferDetails
            .convert(dto, offer.id!!)
            .let(commercialOfferDetailsService::saveAll)

        dto.terms
            ?.let { desc ->
                commercialOfferDetailsDescriptionService
                    .save(desc, offer.id!!)
            }
    }
}