package com.omsk.kp.domain.service.save_kp

import com.omsk.kp.domain.model.CommercialOfferAdditionalServicesService
import com.omsk.kp.domain.model.CommercialOfferHistoryType
import com.omsk.kp.domain.model.CommercialOfferType
import com.omsk.kp.domain.service.CommercialOfferDetailsDescriptionService
import com.omsk.kp.domain.service.CommercialOfferHistoryService
import com.omsk.kp.domain.service.CommercialOfferTotalService
import com.omsk.kp.domain.service.UserService
import com.omsk.kp.dto.KPDeleteDTO
import com.omsk.kp.dto.KPSaveDTO
import com.omsk.kp.dto.KPSaveResultDTO
import com.omsk.kp.dto.KPUpdateStatusDTO
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class KPUpdateService(
    private val userService: UserService,
    private val kpDetailsService: KPDetailsService,
    private val commercialOfferService: CommercialOfferService,
    private val commercialOfferTotalService: CommercialOfferTotalService,
    private val commercialOfferHistoryService: CommercialOfferHistoryService,
    private val commercialOfferDetailsService: CommercialOfferDetailsService,
    private val commercialOfferAdditionalServicesService: CommercialOfferAdditionalServicesService,
    private val commercialOfferDetailsDescriptionService: CommercialOfferDetailsDescriptionService
) {

    @Transactional
    fun update(dto: KPSaveDTO): KPSaveResultDTO {
        val manager = userService
            .findById(dto.managerId)
            ?: throw RuntimeException("Менеджер не найден!")

        val offer = findOffer(dto.offerId!!)

        commercialOfferTotalService.deleteByOfferId(offer.id!!)
        commercialOfferDetailsService.deleteByOfferId(offer.id!!)
        commercialOfferDetailsDescriptionService.deleteByOfferId(offer.id!!)
        commercialOfferAdditionalServicesService.deleteByOfferId(offer.id!!)

        kpDetailsService.save(offer.id!!, dto)

        commercialOfferHistoryService
            .save(offer.id!!, dto.managerId, CommercialOfferHistoryType.DATA_CHANGE)

        return KPSaveResultDTO(offer, manager)
    }

    @Transactional
    fun updateStatus(dto: KPUpdateStatusDTO): Long {
        val offer = findOffer(dto.offerId)

        offer.type = CommercialOfferType
            .fromString(dto.new)
            ?: throw RuntimeException("Данного типа ${dto.new} не существует!")

        commercialOfferHistoryService
            .save(offer.id!!, dto.managerId, CommercialOfferHistoryType.STATUS_CHANGED)

        return commercialOfferService
            .save(offer)
            .id!!
    }

    @Transactional
    fun deleteOffer(dto: KPDeleteDTO): Long {
        val offer = findOffer(dto.offerId)

        commercialOfferService
            .delete(offer)

        return offer.id!!
    }

    private fun findOffer(offerId: Long) = commercialOfferService
        .findById(offerId)
        ?: throw RuntimeException("Коммерческое предложение не найдено!")
}