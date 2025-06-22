package com.omsk.kp.domain.service.save_kp

import com.omsk.kp.domain.service.UserService
import com.omsk.kp.domain.service.save_kp.converter.KPSaveDtoToCommercialOffer
import com.omsk.kp.dto.KPSaveDTO
import com.omsk.kp.dto.KPSaveResultDTO
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import kotlin.jvm.optionals.getOrNull

@Service
class KPSaveService(
    private val userService: UserService,
    private val kpDetailsService: KPDetailsService,
    private val commercialOfferService: CommercialOfferService
) {
    private val kpSaveDtoToCommercialOffer = KPSaveDtoToCommercialOffer()

    @Transactional
    fun save(dto: KPSaveDTO): KPSaveResultDTO {
        val manager = userService
            .findById(dto.managerId)
            .getOrNull()
            ?: throw RuntimeException("Менеджер не найден!")

        val offer = kpSaveDtoToCommercialOffer
            .convert(dto)
            .let( commercialOfferService::save )

        kpDetailsService.save(offer.id!!, dto)

        return KPSaveResultDTO(offer, manager)
    }
}