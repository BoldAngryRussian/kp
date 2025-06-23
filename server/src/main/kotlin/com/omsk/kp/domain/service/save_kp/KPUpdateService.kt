package com.omsk.kp.domain.service.save_kp

import com.omsk.kp.domain.model.CommercialOfferHistoryType
import com.omsk.kp.domain.service.CommercialOfferDetailsDescriptionService
import com.omsk.kp.domain.service.CommercialOfferHistoryService
import com.omsk.kp.domain.service.CommercialOfferTotalService
import com.omsk.kp.domain.service.UserService
import com.omsk.kp.dto.KPSaveDTO
import com.omsk.kp.dto.KPSaveResultDTO
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import kotlin.jvm.optionals.getOrNull

@Service
class KPUpdateService(
    private val userService: UserService,
    private val kpDetailsService: KPDetailsService,
    private val commercialOfferService: CommercialOfferService,
    private val commercialOfferTotalService: CommercialOfferTotalService,
    private val commercialOfferHistoryService: CommercialOfferHistoryService,
    private val commercialOfferDetailsService: CommercialOfferDetailsService,
    private val commercialOfferDetailsDescriptionService: CommercialOfferDetailsDescriptionService
) {

    @Transactional
    fun update(dto: KPSaveDTO): KPSaveResultDTO {
        val manager = userService
            .findById(dto.managerId)
            .getOrNull()
            ?: throw RuntimeException("Менеджер не найден!")

        val offer = commercialOfferService
            .findById(dto.offerId!!)
            .getOrNull()
            ?: throw RuntimeException("Коммерческое предложение не найдено!")

        commercialOfferTotalService.deleteByOfferId(offer.id!!)
        commercialOfferDetailsService.deleteByOfferId(offer.id!!)
        commercialOfferDetailsDescriptionService.deleteByOfferId(offer.id!!)

        kpDetailsService.save(offer.id!!, dto)

        commercialOfferHistoryService
            .save(offer.id!!, dto.managerId, CommercialOfferHistoryType.DATA_CHANGE)

        return KPSaveResultDTO(offer, manager)
    }
}