package com.omsk.kp.service.kp

import com.omsk.kp.domain.model.CommercialOfferDetailsTemperatureMode
import com.omsk.kp.domain.model.getTemperatureModeOrDefault
import com.omsk.kp.domain.service.CommercialOfferHistoryService
import com.omsk.kp.dto.KPInfoTotal
import com.omsk.kp.dto.KPTotalInfoCustomer
import com.omsk.kp.dto.KPTotalInfoManager
import com.omsk.kp.dto.KPTotalInfoProduct
import com.omsk.kp.dto.KPTotalInfoResult
import com.omsk.kp.dto.WeightTemperatureMode
import com.omsk.kp.service.KPOfferComplexCalculation
import com.omsk.kp.utils.toDate
import org.springframework.stereotype.Service

@Service
class KPFindDetailsService(
    private val kpOfferComplexCalculation: KPOfferComplexCalculation,
    private val commercialOfferHistoryService: CommercialOfferHistoryService
) {
    fun findByOfferId(offerId: Long): KPTotalInfoResult {
        val (offer, customer, manager, products, total) = kpOfferComplexCalculation
            .calculate(offerId)

        val history = commercialOfferHistoryService.getHistory(offerId)

        return KPTotalInfoResult(
            customerName = customer.company,
            created = toDate( offer.createdAt),
            customer = KPTotalInfoCustomer(customer),
            manager = KPTotalInfoManager(manager),
            finance = KPInfoTotal(total),
            products = products
                .map { KPTotalInfoProduct(it) },
            weightByTemperatureMode = products
                .groupBy { it.getTemperatureModeOrDefault() }
                .mapValues { (_, list) -> list.sumOf { it.weightKg * it.quantity } }
                .map { WeightTemperatureMode(it) }
                .sortedBy { CommercialOfferDetailsTemperatureMode.fromDesc(it.mode)!!.ordinal  },
            history = history
        )
    }
}