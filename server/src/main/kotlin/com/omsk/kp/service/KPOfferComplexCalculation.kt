package com.omsk.kp.service

import com.omsk.kp.domain.model.CommercialOfferAdditionalServicesService
import com.omsk.kp.domain.service.CommercialOfferTotalService
import com.omsk.kp.domain.service.CustomerService
import com.omsk.kp.domain.service.UserService
import com.omsk.kp.domain.service.save_kp.CommercialOfferDetailsService
import com.omsk.kp.domain.service.save_kp.CommercialOfferService
import com.omsk.kp.dto.AdditionalServicesDTO
import com.omsk.kp.dto.KPOfferComplexInfo
import org.springframework.stereotype.Component
import kotlin.jvm.optionals.getOrNull

@Component
class KPOfferComplexCalculation(
    private val userService: UserService,
    private val customerService: CustomerService,
    private val commercialOfferService: CommercialOfferService,
    private val commercialOfferTotalService: CommercialOfferTotalService,
    private val commercialOfferDetailsService: CommercialOfferDetailsService,
    private val commercialOfferAdditionalServicesService: CommercialOfferAdditionalServicesService
) {
    fun calculate(offerId: Long): KPOfferComplexInfo {
        val offer = commercialOfferService
            .findById(offerId)
            ?: throw RuntimeException("Коммерческое предложение не найдено!")

        val customer = customerService
            .findById(offer.customerId)
            ?: throw RuntimeException("Заказчик не найден!")

        val manager = userService
            .findById(offer.managerId)
            ?: throw RuntimeException("Менеджер не найден!")

        val products = commercialOfferDetailsService
            .findAllByOfferId(offerId)

        if (products.isEmpty())
            throw RuntimeException("В коммерческом предложении нет продуктов!")

        val total = commercialOfferTotalService
            .findByOfferId(offerId)

        val additionalServicesDTOs = commercialOfferAdditionalServicesService
            .findAllByOfferId(offerId)
            .map { AdditionalServicesDTO(it) }

        return KPOfferComplexInfo(offer, customer, manager, products, total, additionalServicesDTOs)
    }
}