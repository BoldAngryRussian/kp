package com.omsk.kp.domain.service.save_kp

import com.omsk.kp.converter.KPInfoTotalToCommercialOfferTotalConverter
import com.omsk.kp.domain.service.CommercialOfferDetailsDescriptionService
import com.omsk.kp.domain.service.CommercialOfferTotalService
import com.omsk.kp.domain.service.save_kp.converter.KPSaveDtoToCommercialOfferDetails
import com.omsk.kp.dto.KPSaveDTO
import com.omsk.kp.service.kp.KPTotalInfoCalculation
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class KPDetailsService(
    private val commercialOfferTotalService: CommercialOfferTotalService,
    private val commercialOfferDetailsService: CommercialOfferDetailsService,
    private val commercialOfferDetailsDescriptionService: CommercialOfferDetailsDescriptionService
) {
    private val kpTotalInfoCalculation = KPTotalInfoCalculation()
    private val kpSaveDtoToCommercialOfferDetails = KPSaveDtoToCommercialOfferDetails()
    private val kpInfoTotalToCommercialOfferTotalConverter = KPInfoTotalToCommercialOfferTotalConverter()

    @Transactional
    fun save(offerId: Long, dto: KPSaveDTO){

        val products = kpSaveDtoToCommercialOfferDetails
            .convert(dto, offerId)
            .let(commercialOfferDetailsService::saveAll)

        val total = kpTotalInfoCalculation.calculate(products)

        kpInfoTotalToCommercialOfferTotalConverter
            .convert(total, offerId)
            .let(commercialOfferTotalService::save)

         if (dto.terms != null){
             commercialOfferDetailsDescriptionService
                 .save(dto.terms, offerId)
         }
    }
}